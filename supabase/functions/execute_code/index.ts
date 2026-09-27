// Supabase Edge Function: execute_code
// Secure Python Execution & Test Case Validation Handler
// Deploy with: supabase functions deploy execute_code --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestCasePayload {
  id: string;
  input: string;
  is_hidden: boolean;
  marks: number;
}

interface ExecuteRequest {
  code: string;
  language: string;
  problem_id: string;
  test_cases: TestCasePayload[];
  time_limit_seconds?: number;
  participant_id?: string;
  round_id?: number;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: ExecuteRequest = await req.json();
    const { code, language, problem_id, test_cases, time_limit_seconds = 5, participant_id, round_id = 2 } = payload;

    if (!code || !code.trim()) {
      return new Response(
        JSON.stringify({ error: "Code buffer is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (language !== "python") {
      return new Response(
        JSON.stringify({ error: "Only Python language execution is supported" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase admin client to fetch authoritative test cases (including hidden expected outputs)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch authoritative test cases from DB so participant cannot supply fake expected outputs
    let authoritativeTestCases: any[] = [];
    if (problem_id) {
      const { data: dbCases, error: dbErr } = await supabase
        .from("debug_test_cases")
        .select("id, input, expected_output, is_hidden, marks")
        .eq("problem_id", problem_id);

      if (!dbErr && dbCases && dbCases.length > 0) {
        authoritativeTestCases = dbCases;
      }
    }

    // Fallback to provided test case definitions if database records are empty
    if (authoritativeTestCases.length === 0 && test_cases) {
      authoritativeTestCases = test_cases;
    }

    // Connect to isolated sandboxed execution service (e.g. self-hosted Piston or isolated worker)
    const sandboxEndpoint = Deno.env.get("SANDBOX_API_URL") || "http://piston:2000/api/v2/execute";
    const results = [];
    let totalScore = 0;
    let maxScore = 0;

    for (let i = 0; i < authoritativeTestCases.length; i++) {
      const tc = authoritativeTestCases[i];
      maxScore += Number(tc.marks || 10);
      const startTime = Date.now();

      let actualOutput = "";
      let hasPassed = false;
      let errorMessage = "";
      let executionTimeMs = 0;

      try {
        // Run against secure sandbox container with strict timeout
        const sandboxRes = await fetch(sandboxEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: "python",
            version: "3.10.0",
            files: [{ name: "solution.py", content: code }],
            stdin: tc.input || "",
            run_timeout: (time_limit_seconds || 5) * 1000,
          }),
        });

        executionTimeMs = Date.now() - startTime;

        if (sandboxRes.ok) {
          const runData = await sandboxRes.json();
          const run = runData.run || {};
          actualOutput = (run.stdout || "").trim();
          const stderr = (run.stderr || "").trim();

          if (run.signal === "SIGKILL" || run.code === 137) {
            errorMessage = "Time Limit Exceeded";
          } else if (stderr) {
            errorMessage = stderr;
          } else {
            const expectedClean = String(tc.expected_output || "").trim();
            if (actualOutput === expectedClean) {
              hasPassed = true;
              totalScore += Number(tc.marks || 10);
            } else {
              errorMessage = "Output did not match expected result";
            }
          }
        } else {
          errorMessage = "Sandbox runner returned HTTP " + sandboxRes.status;
        }
      } catch (err: any) {
        executionTimeMs = Date.now() - startTime;
        errorMessage = err.message || "Failed to reach execution sandbox";
      }

      // Format response, strictly ensuring hidden test cases do not reveal expected_output
      results.push({
        test_case_id: tc.id,
        test_case_number: i + 1,
        passed: hasPassed,
        is_hidden: Boolean(tc.is_hidden),
        actual_output: tc.is_hidden ? (hasPassed ? "[VERIFIED]" : "[MISMATCH]") : actualOutput,
        expected_output: tc.is_hidden ? "[HIDDEN]" : tc.expected_output,
        execution_time_ms: executionTimeMs,
        error_message: errorMessage || undefined,
        marks: hasPassed ? Number(tc.marks || 10) : 0,
      });
    }

    const passedCount = results.filter((r) => r.passed).length;

    // Persist code submission if participant_id is provided
    if (participant_id) {
      try {
        const { data: subData } = await supabase
          .from("code_submissions")
          .insert({
            participant_id,
            problem_id,
            round_id,
            source_code: code,
            submitted_at: new Date().toISOString(),
            execution_status: passedCount === results.length ? "All Passed" : "Partial",
            score: totalScore,
            passed_tests: passedCount,
            total_tests: results.length,
          })
          .select()
          .single();

        if (subData) {
          const tcResults = results.map((r) => ({
            code_submission_id: subData.id,
            test_case_id: r.test_case_id,
            passed: r.passed,
            execution_time_ms: r.execution_time_ms,
            error_message: r.error_message,
          }));
          await supabase.from("test_case_results").insert(tcResults);
        }
      } catch (e) {
        console.warn("Error persisting submission to Supabase:", e);
      }
    }

    return new Response(
      JSON.stringify({
        success: passedCount === results.length,
        passed: passedCount,
        total: results.length,
        score: totalScore,
        max_score: maxScore,
        score_awarded: totalScore,
        results,
        compiler_output: passedCount === results.length
          ? "Execution successful: All test cases passed."
          : `Execution completed: ${passedCount}/${results.length} test cases passed.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Execution service internal failure" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
