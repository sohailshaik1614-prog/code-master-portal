/**
 * Code Execution Service Interface
 * Connected to Supabase Edge Function `/functions/v1/execute_code`
 * 
 * STRICT SECURITY ARCHITECTURE:
 * 1. Participant Python code is NEVER executed in the browser (no eval, exec, new Function).
 * 2. Execution must run through Supabase Edge Function in an isolated sandbox.
 * 3. Hidden test cases NEVER reveal expected output to participants.
 * 4. If the backend Edge Function is not yet deployed, the service clearly identifies
 *    the missing dependency without compromising security.
 */

import { TestCase, TestCaseResult } from '../types';
import { supabase } from './supabaseClient';

export interface CodeExecutionRequest {
  code: string;
  language: 'python';
  testCases: TestCase[];
  problemId?: string;
  timeLimitSeconds?: number;
}

export interface CodeExecutionResponse {
  success: boolean;
  totalTestCases: number;
  passedCount: number;
  failedCount: number;
  scoreAwarded: number;
  maxScore: number;
  results: TestCaseResult[];
  compilerOutput?: string;
  executionTimeMs?: number;
  isBackendConnected: boolean;
  edgeFunctionMissing?: boolean;
}

export const codeExecutionService = {
  /**
   * Executes Python code against test cases via Supabase Edge Function
   */
  async runTestCases(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const { code, testCases, problemId, timeLimitSeconds } = request;

    if (!code || !code.trim()) {
      return {
        success: false,
        totalTestCases: testCases.length,
        passedCount: 0,
        failedCount: testCases.length,
        scoreAwarded: 0,
        maxScore: testCases.reduce((acc, tc) => acc + tc.marks, 0),
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          passed: false,
          isHidden: tc.isHidden,
          input: tc.input,
          errorMessage: 'No code provided for execution.',
        })),
        compilerOutput: 'Error: Empty code buffer submitted.',
        isBackendConnected: false,
      };
    }

    const maxScore = testCases.reduce((acc, tc) => acc + tc.marks, 0);

    // 1. Attempt execution via Supabase Edge Function: execute_code
    try {
      const { data, error } = await supabase.functions.invoke('execute_code', {
        body: {
          code,
          language: 'python',
          problem_id: problemId,
          test_cases: testCases.map((tc) => ({
            id: tc.id,
            input: tc.input,
            is_hidden: tc.isHidden,
            marks: tc.marks,
          })),
          time_limit_seconds: timeLimitSeconds || 5,
        },
      });

      if (!error && data) {
        // Map backend test results ensuring hidden test outputs are masked
        const mappedResults: TestCaseResult[] = (data.results || []).map((r: any, idx: number) => {
          const tc = testCases[idx] || {};
          const isHidden = Boolean(tc.isHidden ?? r.is_hidden);
          return {
            testCaseId: r.test_case_id || tc.id || `tc-${idx}`,
            passed: Boolean(r.passed),
            isHidden,
            input: tc.input || r.input || '',
            actualOutput: isHidden ? (r.passed ? '[OUTPUT VERIFIED]' : '[OUTPUT MISMATCH]') : r.actual_output,
            expectedOutput: isHidden ? '[HIDDEN TEST CASE]' : (tc.expectedOutput || r.expected_output),
            executionTimeMs: Number(r.execution_time_ms || 35),
            errorMessage: r.error_message || (r.passed ? undefined : 'Output did not match expected result'),
          };
        });

        const passedCount = mappedResults.filter((r) => r.passed).length;

        return {
          success: passedCount === testCases.length,
          totalTestCases: testCases.length,
          passedCount,
          failedCount: testCases.length - passedCount,
          scoreAwarded: Number(data.score_awarded ?? mappedResults.reduce((acc, r, i) => acc + (r.passed ? testCases[i]?.marks || 0 : 0), 0)),
          maxScore,
          results: mappedResults,
          compilerOutput: data.compiler_output || (passedCount === testCases.length ? 'Execution completed: All test cases passed.' : 'Execution completed: Discrepancies found.'),
          executionTimeMs: Number(data.execution_time_ms || 120),
          isBackendConnected: true,
        };
      }
    } catch (e: any) {
      console.warn('Supabase Edge Function execute_code unavailable:', e);
    }

    // 2. Missing Backend Dependency Handling:
    // As per specification: If the backend code execution function does not exist yet,
    // create only the integration interface and clearly identify the missing backend dependency.
    // Do not implement unsafe Python execution in the browser.
    const safeSimulationResults: TestCaseResult[] = testCases.map((tc) => ({
      testCaseId: tc.id,
      passed: false,
      isHidden: tc.isHidden,
      input: tc.input,
      expectedOutput: tc.isHidden ? '[HIDDEN TEST CASE]' : tc.expectedOutput,
      actualOutput: '[PENDING BACKEND EXECUTION]',
      errorMessage: 'Supabase Edge Function /functions/v1/execute_code is not deployed. Python code must be executed in a secure isolated environment.',
    }));

    return {
      success: false,
      totalTestCases: testCases.length,
      passedCount: 0,
      failedCount: testCases.length,
      scoreAwarded: 0,
      maxScore,
      results: safeSimulationResults,
      compilerOutput: 'Backend Dependency Notice: Supabase Edge Function `execute_code` is required for sandboxed Python execution.',
      executionTimeMs: 0,
      isBackendConnected: false,
      edgeFunctionMissing: true,
    };
  },

  /**
   * Final submission of code
   */
  async submitCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    return this.runTestCases(request);
  },
};
