/**
 * CODEMASTERS - Vel Tech University Coding Club - CSE(AIML)
 * Core TypeScript Data Models and Interfaces
 * Frontend-only application type definitions
 */

export type RoundStatus = 
  | 'Not Started'
  | 'Available'
  | 'In Progress'
  | 'Completed'
  | 'Disqualified'
  | 'Locked'
  | 'Scheduled'
  | 'Live'
  | 'Ended';

export type ParticipantStatus =
  | 'Registered'
  | 'Round 1 Eligible'
  | 'Round 1 In Progress'
  | 'Round 1 Completed'
  | 'Qualified'
  | 'Round 2 Eligible'
  | 'Round 2 In Progress'
  | 'Round 2 Completed'
  | 'Disqualified';

export type ActivityStatus = 'Active' | 'Idle' | 'Disqualified' | 'Not Started';

export interface Participant {
  id: string;
  fullName: string;
  vtuNumber: string;
  vtuEmail: string;
  registeredAt: string;
  status: ParticipantStatus;
  currentRound: 1 | 2 | null;
  round1Status: RoundStatus;
  round2Status: RoundStatus;
  round1Score: number | null;
  round2Score: number | null;
  totalScore: number;
  warningsCount: number; // 0 to 3
  isDisqualified: boolean;
  disqualificationReason?: string;
  submissionTimestamp?: string; // authoritative submission time for tie-breaking
  lastActive?: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'event_coordinator' | 'evaluator';
  lastLogin: string;
}

export interface Round {
  id: string;
  number: 1 | 2;
  title: string;
  type: 'MCQ' | 'Debugging';
  description: string;
  status: RoundStatus;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
}

export interface MCQQuestion {
  id: string;
  roundId: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D'; // Admin sets this; never exposed to participants in exam view
  marks: number;
  negativeMarks: number;
  status: 'active' | 'draft';
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean; // Hidden test cases must not reveal expected output to participants
  marks: number;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  isHidden: boolean;
  input: string;
  actualOutput?: string;
  expectedOutput?: string; // only if !isHidden
  executionTimeMs?: number;
  errorMessage?: string;
}

export interface DebuggingQuestion {
  id: string;
  roundId: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  buggyCode: string;
  marks: number;
  timeLimitSeconds: number;
  testCases: TestCase[];
  status: 'active' | 'draft';
}

export interface Submission {
  id: string;
  participantId: string;
  participantName: string;
  vtuNumber: string;
  roundId: 1 | 2;
  submittedAt: string; // ISO String timestamp used for tie-breaking
  score: number;
  maxScore: number;
  status: 'Submitted' | 'Auto-Submitted' | 'Disqualified' | 'Evaluated';
  details?: Record<string, any>;
}

export interface LeaderboardEntry {
  rank: number;
  participantId: string;
  fullName: string;
  vtuNumber: string;
  round1Score: number;
  round2Score: number;
  totalScore: number;
  submissionTimestamp: string; // Earlier submission wins ties
  status: 'Active' | 'Disqualified' | 'Completed';
}

export interface Warning {
  id: string;
  participantId: string;
  participantName: string;
  vtuNumber: string;
  roundNumber: 1 | 2;
  warningNumber: 1 | 2 | 3;
  reason: 'Tab switching detected' | 'Window blur detected' | 'Clipboard copy prevented' | 'Clipboard paste prevented' | 'Context menu blocked' | 'Restricted shortcut used' | string;
  message: string;
  timestamp: string;
}

export interface RoundPermission {
  participantId: string;
  vtuNumber: string;
  roundNumber: 1 | 2;
  hasPermission: boolean;
  reason?: string;
  grantedBy?: string;
  grantedAt?: string;
}

export interface EventSchedule {
  round1Start: string;
  round1End: string;
  round1DurationMinutes: number;
  round1Status: RoundStatus;
  round2Start: string;
  round2End: string;
  round2DurationMinutes: number;
  round2Status: RoundStatus;
}

export interface AppConfig {
  vtuEmailDomain: string;
  vtuDigitsLength: number; // Configurable digits count (default: 5)
  maxWarningsPerRound: number; // 3
  autoSubmitOnExpire: boolean;
  allowCodeFormatting: boolean;
}
