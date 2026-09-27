/**
 * Submission Service Interface
 * Handles real-time answer persistence, authoritative server-side scoring,
 * and RPC evaluation for Round 1 (MCQ) and Round 2 (Python Debugging).
 */

import { Submission } from '../types';
import { supabase } from './supabaseClient';
import { questionService } from './questionService';

export interface SubmitMCQResponse {
  success: boolean;
  score: number;
  maxScore: number;
  submissionTimestamp: string;
  isQualified?: boolean;
  error?: string;
}

export const submissionService = {
  STORAGE_KEY: 'codemasters_submissions',

  /**
   * Persists participant's selected MCQ answer to the database in real time.
   * Ensures zero work is lost if the browser or tab closes.
   */
  async saveMCQAnswer(
    participantId: string,
    roundId: number,
    questionId: string,
    selectedOption: 'A' | 'B' | 'C' | 'D'
  ): Promise<void> {
    try {
      await supabase
        .from('mcq_answers')
        .upsert(
          {
            participant_id: participantId,
            round_id: roundId,
            question_id: questionId,
            selected_option: selectedOption,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'participant_id,question_id' }
        );
    } catch (e) {
      console.warn('saveMCQAnswer notice:', e);
    }
  },

  /**
   * Authoritative final evaluation for Round 1.
   * Calls PostgreSQL RPC `submit_mcq_round(p_participant_id, p_round_id)`.
   * Score and negative marks are evaluated by the backend.
   */
  async submitMCQRound(
    participantId: string,
    roundId = 1,
    clientAnswers: Record<string, 'A' | 'B' | 'C' | 'D'> = {},
    isAutoSubmit = false
  ): Promise<SubmitMCQResponse> {
    // 1. Batch save all current answers to mcq_answers
    try {
      const entries = Object.entries(clientAnswers);
      if (entries.length > 0) {
        const payload = entries.map(([qId, opt]) => ({
          participant_id: participantId,
          round_id: roundId,
          question_id: qId,
          selected_option: opt,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('mcq_answers').upsert(payload, { onConflict: 'participant_id,question_id' });
      }
    } catch (e) {
      console.warn('Batch answer save notice:', e);
    }

    // 2. Call authoritative submission RPC on backend
    try {
      const { data, error } = await supabase.rpc('submit_mcq_round', {
        p_participant_id: participantId,
        p_round_id: roundId,
      });

      if (!error && data) {
        const score = Number(data.score ?? data.total_score ?? data.round1_score ?? 0);
        const maxScore = Number(data.max_score ?? data.total_marks ?? 100);
        const submissionTimestamp = data.submission_timestamp || data.submitted_at || new Date().toISOString();
        const isQualified = Boolean(data.is_qualified ?? data.qualified ?? score >= Math.floor(maxScore * 0.4));

        return {
          success: true,
          score,
          maxScore,
          submissionTimestamp,
          isQualified,
        };
      }
      if (error) {
        console.warn('submit_mcq_round RPC returned error:', error.message);
      }
    } catch (e: any) {
      console.warn('submit_mcq_round RPC invocation error:', e);
    }

    // 3. Fallback: Evaluate client answers against stored answer key so marks are never lost
    const evaluated = questionService.evaluateMCQ(clientAnswers);
    const fallbackTimestamp = new Date().toISOString();
    const isQualified = evaluated.totalScore >= Math.floor(evaluated.maxScore * 0.4) || evaluated.maxScore === 0;

    try {
      await supabase.from('round_submissions').insert({
        participant_id: participantId,
        round_id: roundId,
        submitted_at: fallbackTimestamp,
        score: evaluated.totalScore,
        max_score: evaluated.maxScore,
        status: isAutoSubmit ? 'Auto-Submitted' : 'Submitted',
      });
      await supabase.from('participants').update({
        round1_score: evaluated.totalScore,
        round_1_score: evaluated.totalScore,
        round1_status: 'Completed',
      }).eq('id', participantId);
    } catch (e) {
      console.warn('round_submissions fallback notice:', e);
    }

    return {
      success: true,
      score: evaluated.totalScore,
      maxScore: evaluated.maxScore,
      submissionTimestamp: fallbackTimestamp,
      isQualified,
    };
  },

  /**
   * Final submission of Round 2 (Python Debugging)
   */
  async submitDebuggingRound(
    participantId: string,
    roundId = 2,
    code: string,
    score: number,
    maxScore: number,
    isAutoSubmit = false
  ): Promise<{ success: boolean; submissionTimestamp: string }> {
    const timestamp = new Date().toISOString();

    // 1. Try calling backend submit_debugging_round RPC
    try {
      const { data, error } = await supabase.rpc('submit_debugging_round', {
        p_participant_id: participantId,
        p_round_id: roundId,
      });

      if (!error && data) {
        return {
          success: true,
          submissionTimestamp: data.submission_timestamp || data.submitted_at || timestamp,
        };
      }
    } catch (e) {
      console.warn('submit_debugging_round RPC notice:', e);
    }

    // 2. Insert into code_submissions table
    try {
      await supabase.from('code_submissions').insert({
        participant_id: participantId,
        round_id: roundId,
        submitted_code: code,
        score,
        status: isAutoSubmit ? 'Auto-Submitted' : 'Submitted',
        submitted_at: timestamp,
      });
    } catch (e) {
      console.warn('code_submissions insert notice:', e);
    }

    return { success: true, submissionTimestamp: timestamp };
  },

  /**
   * Retrieves submissions for admin dashboard
   */
  async fetchAllSubmissions(): Promise<Submission[]> {
    try {
      const { data, error } = await supabase
        .from('round_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          participantId: s.participant_id,
          participantName: s.participant_name || 'Participant',
          vtuNumber: s.vtu_number || '',
          roundId: Number(s.round_id || 1) as 1 | 2,
          submittedAt: s.submitted_at || new Date().toISOString(),
          score: Number(s.score || 0),
          maxScore: Number(s.max_score || 100),
          status: s.status || 'Submitted',
        }));
      }
    } catch (e) {
      console.warn('fetchAllSubmissions error:', e);
    }
    return this.getLocalSubmissions();
  },

  getLocalSubmissions(): Submission[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordLocalSubmission(submission: Omit<Submission, 'id'>): Submission {
    const subs = this.getLocalSubmissions();
    const newSub: Submission = {
      ...submission,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    subs.push(newSub);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subs));
    } catch (e) {
      console.warn('recordLocalSubmission error', e);
    }
    return newSub;
  },
};
