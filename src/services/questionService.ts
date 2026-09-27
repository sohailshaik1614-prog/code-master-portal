/**
 * Question Service Interface
 * Connected to Supabase Database with strict participant data sanitization.
 * 
 * SECURITY RULES:
 * 1. Participants NEVER receive `correct_answer` over the wire.
 * 2. Participants NEVER receive hidden test-case `expected_output`.
 * 3. Authoritative scoring runs on the backend.
 */

import { MCQQuestion, DebuggingQuestion, TestCase } from '../types';
import { supabase } from './supabaseClient';

export function mapDbToMCQ(q: any): MCQQuestion {
  return {
    id: q.id,
    roundId: String(q.round_id || 1),
    questionNumber: Number(q.question_number || 1),
    questionText: q.question_text || '',
    optionA: q.option_a || '',
    optionB: q.option_b || '',
    optionC: q.option_c || '',
    optionD: q.option_d || '',
    correctAnswer: (q.correct_answer || q.correct_option || 'A') as 'A' | 'B' | 'C' | 'D',
    marks: Number(q.marks || 1),
    negativeMarks: Number(q.negative_marks || 0),
    status: (q.status || 'active') as 'active' | 'draft',
  };
}

export function mapDbToDebugging(p: any, testCases: any[] = []): DebuggingQuestion {
  const mappedTestCases: TestCase[] = (testCases || []).map((tc) => ({
    id: tc.id,
    input: tc.input || '',
    expectedOutput: tc.is_hidden ? '[HIDDEN TEST CASE]' : (tc.expected_output || ''),
    isHidden: Boolean(tc.is_hidden),
    marks: Number(tc.marks || 10),
  }));

  return {
    id: p.id,
    roundId: String(p.round_id || 2),
    title: p.title || '',
    description: p.description || '',
    difficulty: (p.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
    buggyCode: p.buggy_code || '',
    marks: Number(p.marks || 100),
    timeLimitSeconds: Number(p.time_limit_seconds || 5),
    testCases: mappedTestCases,
    status: (p.status || 'active') as 'active' | 'draft',
  };
}

export const questionService = {
  STORAGE_KEYS: {
    MCQ: 'codemasters_mcq_questions',
    DEBUG: 'codemasters_debug_questions',
  },

  /**
   * Fetches sanitized MCQ questions for participants.
   * NEVER exposes `correctAnswer` to participants.
   */
  async fetchParticipantMCQQuestions(roundId = 1): Promise<Omit<MCQQuestion, 'correctAnswer'>[]> {
    try {
      // 1. Try server RPC function get_participant_mcq_questions
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_participant_mcq_questions', {
        p_round_id: roundId,
      });

      if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
        return rpcData.map((q) => {
          const { correct_answer: _a, correct_option: _b, ...rest } = q;
          return mapDbToMCQ(rest);
        });
      }

      // 2. Query table directly while strictly omitting correct_answer column
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('id, round_id, question_number, question_text, option_a, option_b, option_c, option_d, marks, negative_marks, status')
        .eq('status', 'active')
        .order('question_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((q) => mapDbToMCQ(q));
      }
    } catch (e) {
      console.warn('Supabase fetch participant MCQ questions notice:', e);
    }

    // Fallback to local storage cache if offline
    return this.sanitizeMCQForParticipant(this.getStoredMCQQuestions());
  },

  /**
   * Fetches full MCQ questions for administrators (includes answer keys)
   */
  async fetchAdminMCQQuestions(): Promise<MCQQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('*')
        .order('question_number', { ascending: true });

      if (!error && data && data.length > 0) {
        const questions = data.map(mapDbToMCQ);
        this.saveMCQQuestions(questions);
        return questions;
      }
    } catch (e) {
      console.warn('Supabase fetch admin MCQ questions error:', e);
    }
    return this.getStoredMCQQuestions();
  },

  /**
   * Admin creates a new MCQ Question in Supabase
   */
  async createMCQQuestion(q: Omit<MCQQuestion, 'id'>): Promise<MCQQuestion | null> {
    try {
      const { data, error } = await supabase
        .from('mcq_questions')
        .insert({
          round_id: Number(q.roundId) || 1,
          question_number: q.questionNumber,
          question_text: q.questionText,
          option_a: q.optionA,
          option_b: q.optionB,
          option_c: q.optionC,
          option_d: q.optionD,
          correct_answer: q.correctAnswer,
          marks: q.marks,
          negative_marks: q.negativeMarks,
          status: q.status,
        })
        .select()
        .single();

      if (!error && data) {
        return mapDbToMCQ(data);
      }
      if (error) console.warn('Supabase insert MCQ error:', error.message);
    } catch (e) {
      console.warn('createMCQQuestion error:', e);
    }
    return null;
  },

  /**
   * Admin updates an existing MCQ Question in Supabase
   */
  async updateMCQQuestion(q: MCQQuestion): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mcq_questions')
        .update({
          question_number: q.questionNumber,
          question_text: q.questionText,
          option_a: q.optionA,
          option_b: q.optionB,
          option_c: q.optionC,
          option_d: q.optionD,
          correct_answer: q.correctAnswer,
          marks: q.marks,
          negative_marks: q.negativeMarks,
          status: q.status,
        })
        .eq('id', q.id);

      return !error;
    } catch (e) {
      console.warn('updateMCQQuestion error:', e);
      return false;
    }
  },

  /**
   * Admin deletes an MCQ Question from Supabase
   */
  async deleteMCQQuestion(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mcq_questions')
        .delete()
        .eq('id', id);

      return !error;
    } catch (e) {
      console.warn('deleteMCQQuestion error:', e);
      return false;
    }
  },

  /**
   * Fetches debugging problems for participants.
   * Never exposes hidden test cases' expected outputs.
   */
  async fetchParticipantDebuggingProblems(roundId = 2): Promise<DebuggingQuestion[]> {
    try {
      // 1. Try server RPC function get_participant_debugging_problems
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_participant_debugging_problems', {
        p_round_id: roundId,
      });

      if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
        return rpcData.map((p) => mapDbToDebugging(p, p.test_cases || []));
      }

      // 2. Query debugging_problems and debug_test_cases directly
      const { data: problems, error: pErr } = await supabase
        .from('debugging_problems')
        .select('*')
        .eq('status', 'active');

      if (!pErr && problems && problems.length > 0) {
        const problemIds = problems.map((p) => p.id);
        const { data: testCases } = await supabase
          .from('debug_test_cases')
          .select('id, problem_id, input, expected_output, is_hidden, marks')
          .in('problem_id', problemIds);

        return problems.map((p) => {
          const tc = (testCases || []).filter((t) => t.problem_id === p.id);
          return mapDbToDebugging(p, tc);
        });
      }
    } catch (e) {
      console.warn('fetchParticipantDebuggingProblems error:', e);
    }
    return this.getStoredDebuggingQuestions();
  },

  /**
   * Fetches full debugging problems for administrators (including hidden outputs)
   */
  async fetchAdminDebuggingProblems(): Promise<DebuggingQuestion[]> {
    try {
      const { data: problems, error } = await supabase
        .from('debugging_problems')
        .select('*');

      if (!error && problems && problems.length > 0) {
        const problemIds = problems.map((p) => p.id);
        const { data: testCases } = await supabase
          .from('debug_test_cases')
          .select('*')
          .in('problem_id', problemIds);

        const fullProblems = problems.map((p) => {
          const tc = (testCases || []).filter((t) => t.problem_id === p.id);
          const mappedCases: TestCase[] = tc.map((t) => ({
            id: t.id,
            input: t.input || '',
            expectedOutput: t.expected_output || '',
            isHidden: Boolean(t.is_hidden),
            marks: Number(t.marks || 10),
          }));

          return {
            id: p.id,
            roundId: String(p.round_id || 2),
            title: p.title || '',
            description: p.description || '',
            difficulty: p.difficulty || 'Medium',
            buggyCode: p.buggy_code || '',
            marks: Number(p.marks || 100),
            timeLimitSeconds: Number(p.time_limit_seconds || 5),
            testCases: mappedCases,
            status: p.status || 'active',
          };
        });

        this.saveDebuggingQuestions(fullProblems);
        return fullProblems;
      }
    } catch (e) {
      console.warn('fetchAdminDebuggingProblems error:', e);
    }
    return this.getStoredDebuggingQuestions();
  },

  /**
   * Admin creates debugging question in Supabase
   */
  async createDebuggingQuestion(q: Omit<DebuggingQuestion, 'id'>): Promise<DebuggingQuestion | null> {
    try {
      const { data: prob, error: pErr } = await supabase
        .from('debugging_problems')
        .insert({
          round_id: Number(q.roundId) || 2,
          title: q.title,
          description: q.description,
          difficulty: q.difficulty,
          buggy_code: q.buggyCode,
          marks: q.marks,
          time_limit_seconds: q.timeLimitSeconds,
          status: q.status,
        })
        .select()
        .single();

      if (!pErr && prob) {
        if (q.testCases && q.testCases.length > 0) {
          const tcInserts = q.testCases.map((tc) => ({
            problem_id: prob.id,
            input: tc.input,
            expected_output: tc.expectedOutput,
            is_hidden: tc.isHidden,
            marks: tc.marks,
          }));

          await supabase.from('debug_test_cases').insert(tcInserts);
        }
        return mapDbToDebugging(prob, q.testCases);
      }
    } catch (e) {
      console.warn('createDebuggingQuestion error:', e);
    }
    return null;
  },

  /**
   * Admin deletes a debugging problem in Supabase
   */
  async deleteDebuggingQuestion(id: string): Promise<boolean> {
    try {
      await supabase.from('debug_test_cases').delete().eq('problem_id', id);
      const { error } = await supabase.from('debugging_problems').delete().eq('id', id);
      return !error;
    } catch (e) {
      console.warn('deleteDebuggingQuestion error:', e);
      return false;
    }
  },

  /**
   * Sanitizes MCQ questions for participants (fallback utility)
   */
  sanitizeMCQForParticipant(questions: MCQQuestion[]): Omit<MCQQuestion, 'correctAnswer'>[] {
    return questions.map(({ correctAnswer: _omit, ...rest }) => rest);
  },

  /**
   * Preliminary client evaluation helper while awaiting authoritative backend evaluation
   */
  evaluateMCQ(
    participantAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>,
    questions: MCQQuestion[]
  ): { totalScore: number; maxScore: number; correctCount: number; wrongCount: number; unattemptedCount: number } {
    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q) => {
      maxScore += q.marks;
      const answer = participantAnswers[q.id];

      if (!answer) {
        unattemptedCount += 1;
      } else if (answer === q.correctAnswer) {
        totalScore += q.marks;
        correctCount += 1;
      } else {
        totalScore -= Math.abs(q.negativeMarks || 0);
        wrongCount += 1;
      }
    });

    return {
      totalScore: Math.max(0, totalScore),
      maxScore,
      correctCount,
      wrongCount,
      unattemptedCount,
    };
  },

  /**
   * Default Competition Seed Questions for Core CS & Algorithmic MCQ (Round 1)
   */
  getDefaultMCQQuestions(): MCQQuestion[] {
    return [
      {
        id: 'mcq-seed-01',
        roundId: '1',
        questionNumber: 1,
        questionText: 'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (BST) containing n nodes?',
        optionA: 'O(1)',
        optionB: 'O(log n)',
        optionC: 'O(n)',
        optionD: 'O(n log n)',
        correctAnswer: 'B',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-02',
        roundId: '1',
        questionNumber: 2,
        questionText: 'Under which condition does the standard QuickSort algorithm with the first element as pivot exhibit its worst-case time complexity of O(n²)?',
        optionA: 'When array elements are randomly distributed',
        optionB: 'When the array is already sorted or reverse sorted',
        optionC: 'When all elements are distinct and positive',
        optionD: 'When the array size is a power of 2',
        correctAnswer: 'B',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-03',
        roundId: '1',
        questionNumber: 3,
        questionText: 'Which data structure follows the Last-In-First-Out (LIFO) order and is fundamentally used for function call execution and recursion?',
        optionA: 'Queue',
        optionB: 'Priority Queue',
        optionC: 'Stack',
        optionD: 'Circular Buffer',
        correctAnswer: 'C',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-04',
        roundId: '1',
        questionNumber: 4,
        questionText: "Dijkstra's shortest path algorithm fails or produces incorrect results when applied to graphs containing which of the following?",
        optionA: 'Directed acyclic edges',
        optionB: 'Disconnected components',
        optionC: 'Negative edge weights',
        optionD: 'Cycles with positive weights',
        correctAnswer: 'C',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-05',
        roundId: '1',
        questionNumber: 5,
        questionText: 'In open addressing with linear probing for hash table collision resolution, what major phenomenon can degrade lookup performance from O(1) towards O(n)?',
        optionA: 'Primary Clustering',
        optionB: 'Deadlock',
        optionC: 'Thrashing',
        optionD: 'Starvation',
        correctAnswer: 'A',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-06',
        roundId: '1',
        questionNumber: 6,
        questionText: 'An inorder traversal (Left, Root, Right) on any valid Binary Search Tree produces elements in which sequence?',
        optionA: 'Decreasing order',
        optionB: 'Strictly non-increasing order',
        optionC: 'Sorted ascending order',
        optionD: 'Level order',
        correctAnswer: 'C',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-07',
        roundId: '1',
        questionNumber: 7,
        questionText: 'Which two essential properties must an algorithmic problem exhibit in order to be effectively solved using Dynamic Programming?',
        optionA: 'Greedy choice property and polynomial bounds',
        optionB: 'Optimal substructure and overlapping subproblems',
        optionC: 'Divide-and-conquer and divide-by-zero',
        optionD: 'Amortized constant time and recursion',
        correctAnswer: 'B',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-08',
        roundId: '1',
        questionNumber: 8,
        questionText: 'Breadth-First Search (BFS) on an unweighted graph traverses vertices using which data structure to determine shortest paths in terms of edge count?',
        optionA: 'Stack',
        optionB: 'Queue',
        optionC: 'Min-Heap',
        optionD: 'Binary Trie',
        correctAnswer: 'B',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-09',
        roundId: '1',
        questionNumber: 9,
        questionText: 'What is the auxiliary space complexity required by the standard MergeSort algorithm on an array of size n?',
        optionA: 'O(1)',
        optionB: 'O(log n)',
        optionC: 'O(n)',
        optionD: 'O(n²)',
        correctAnswer: 'C',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
      {
        id: 'mcq-seed-10',
        roundId: '1',
        questionNumber: 10,
        questionText: "Which of the following is NOT one of Coffman's four necessary conditions for a deadlock to occur in an operating system?",
        optionA: 'Mutual Exclusion',
        optionB: 'Hold and Wait',
        optionC: 'Preemption allowed',
        optionD: 'Circular Wait',
        correctAnswer: 'C',
        marks: 4,
        negativeMarks: 1,
        status: 'active',
      },
    ];
  },

  /**
   * Default Competition Seed Question for Python Debugging (Round 2)
   */
  getDefaultDebuggingQuestions(): DebuggingQuestion[] {
    return [
      {
        id: 'dbg-seed-01',
        roundId: '2',
        title: 'Two Sum Target - Indexing & Lookup Fix',
        description: 'You are given an array of integers nums and an integer target. Return 1-based indices of the two numbers such that they add up to target. The existing code contains off-by-one errors and incorrect key storage.',
        difficulty: 'Medium',
        buggyCode: `def two_sum(nums, target):\n    # Fix the bugs below:\n    seen = {}\n    for i in range(len(nums)):\n        diff = target - nums[i]\n        if diff in seen:\n            return [seen[diff], i + 1]\n        seen[nums[i]] = i + 1\n    return []`,
        marks: 100,
        timeLimitSeconds: 5,
        testCases: [
          { id: 'tc-01', input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[1, 2]', isHidden: false, marks: 35 },
          { id: 'tc-02', input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[2, 3]', isHidden: false, marks: 35 },
          { id: 'tc-03', input: 'nums = [3, 3], target = 6', expectedOutput: '[1, 2]', isHidden: true, marks: 30 },
        ],
        status: 'active',
      },
    ];
  },

  /**
   * Local storage cache helpers with auto-seeding
   */
  getStoredMCQQuestions(): MCQQuestion[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.MCQ);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const defaults = this.getDefaultMCQQuestions();
    this.saveMCQQuestions(defaults);
    return defaults;
  },

  saveMCQQuestions(questions: MCQQuestion[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.MCQ, JSON.stringify(questions));
    } catch (e) {
      console.warn('Unable to persist questions to localStorage', e);
    }
  },

  getStoredDebuggingQuestions(): DebuggingQuestion[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.DEBUG);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const defaults = this.getDefaultDebuggingQuestions();
    this.saveDebuggingQuestions(defaults);
    return defaults;
  },

  saveDebuggingQuestions(questions: DebuggingQuestion[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DEBUG, JSON.stringify(questions));
    } catch (e) {
      console.warn('Unable to persist debugging questions to localStorage', e);
    }
  },
};
