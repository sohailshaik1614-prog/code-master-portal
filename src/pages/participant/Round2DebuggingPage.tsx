import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { useExamTimer } from '../../hooks/useExamTimer';
import { useAntiCheat } from '../../hooks/useAntiCheat';
import { codeExecutionService, CodeExecutionResponse } from '../../services/codeExecutionService';
import { ExamHeader } from '../../components/exam/ExamHeader';
import { CodeEditorView } from '../../components/exam/CodeEditorView';
import { TestCasePanel } from '../../components/exam/TestCasePanel';
import { WarningModal } from '../../components/exam/WarningModal';
import { DisqualificationModal } from '../../components/exam/DisqualificationModal';
import { SubmissionConfirmModal } from '../../components/exam/SubmissionConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Code2, CheckCircle2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Round2DebuggingPageProps {
  onNavigate: (path: string) => void;
}

export const Round2DebuggingPage: React.FC<Round2DebuggingPageProps> = ({ onNavigate }) => {
  const {
    currentParticipant,
    eventSchedule,
    debuggingQuestions,
    submitRound2,
    activeWarningModal,
    closeWarningModal,
  } = useEvent();

  const activeProblem = debuggingQuestions[0]; // Active debugging challenge

  const [code, setCode] = useState<string>(activeProblem?.buggyCode || '');
  const [executionResult, setExecutionResult] = useState<CodeExecutionResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  // Sync initial code if problem loaded
  useEffect(() => {
    if (activeProblem && !code) {
      setCode(activeProblem.buggyCode);
    }
  }, [activeProblem]);

  // Auto-submit when timer expires
  const handleTimeExpired = async () => {
    if (!isSubmitted && activeProblem) {
      const exec = await codeExecutionService.runTestCases({
        code,
        language: 'python',
        testCases: activeProblem.testCases,
        problemId: activeProblem.id,
      });
      submitRound2(code, exec.scoreAwarded, exec.maxScore, true);
      setFinalScore(exec.scoreAwarded);
      setIsSubmitted(true);
    }
  };

  // Exam Countdown Timer
  const { formattedTime, isLowTime } = useExamTimer({
    initialMinutes: eventSchedule.round2DurationMinutes || 90,
    onTimeExpired: handleTimeExpired,
    isRunning: !isSubmitted && !currentParticipant?.isDisqualified,
  });

  // Anti-Cheat Monitoring
  useAntiCheat({
    enabled: !isSubmitted && !currentParticipant?.isDisqualified,
    roundNumber: 2,
    onDisqualified: () => {
      // Disqualification handled via context
    },
  });

  // Run Test Cases against isolated sandbox service
  const handleRunCode = async () => {
    if (!activeProblem || isRunning) return;
    setIsRunning(true);
    try {
      const res = await codeExecutionService.runTestCases({
        code,
        language: 'python',
        testCases: activeProblem.testCases,
        problemId: activeProblem.id,
      });
      setExecutionResult(res);
    } catch {
      // execution error fallback
    } finally {
      setIsRunning(false);
    }
  };

  // Final Submit
  const handleConfirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    if (!activeProblem) return;

    setIsRunning(true);
    const exec = await codeExecutionService.submitCode({
      code,
      language: 'python',
      testCases: activeProblem.testCases,
      problemId: activeProblem.id,
    });
    setIsRunning(false);

    submitRound2(code, exec.scoreAwarded, exec.maxScore, false);
    setFinalScore(exec.scoreAwarded);
    setIsSubmitted(true);

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {
      // confetti
    }
  };

  if (!currentParticipant) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <button onClick={() => onNavigate('/participant/login')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Login to Enter Exam
        </button>
      </div>
    );
  }

  // If already completed prior to entering
  if (currentParticipant.round2Status === 'Completed' && !isSubmitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <CheckCircle2 size={48} color="#00f5a0" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Round 2 Already Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
            Your Python solution has been evaluated and recorded. Your official score is{' '}
            <strong style={{ color: '#00f5a0', fontSize: '1.1rem' }}>{currentParticipant.round2Score} marks</strong>.
          </p>
          <button onClick={() => onNavigate('/participant/dashboard')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Submission Splash
  if (isSubmitted && finalScore !== null) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(0, 245, 160, 0.4)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 245, 160, 0.15)',
              border: '2px solid #00f5a0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#00f5a0',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}>Assessment Finalized</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
            Round 2 (Python Debugging) has been recorded with authoritative submission timestamp.
          </p>

          <div
            style={{
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Debugging Score
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: '#00f5a0' }}>
              {finalScore} / {activeProblem?.marks || 100}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Total Contest Score: <strong>{(currentParticipant.round1Score || 0) + finalScore} marks</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => onNavigate('/admin/leaderboard')} className="btn btn-secondary">
              View Leaderboard
            </button>
            <button onClick={() => onNavigate('/participant/dashboard')} className="btn btn-primary">
              Return to Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state if admin hasn't created debugging problems yet
  if (!activeProblem) {
    return (
      <div className="exam-container">
        <ExamHeader
          roundNumber={2}
          roundTitle="Python Code Debugging"
          formattedTime={formattedTime}
          isLowTime={isLowTime}
          warningsCount={currentParticipant.warningsCount}
          onSubmitClick={() => setIsConfirmModalOpen(true)}
        />
        <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px', width: '100%' }}>
          <EmptyState
            title="No debugging problems currently available"
            description="The Python debugging challenge has not been configured by the organizers yet. Debugging challenges and test cases added in the Admin Portal will appear here."
            icon={<Code2 size={36} color="#00f5a0" />}
            actionText="Go to Admin Portal to Create Problem"
            onAction={() => onNavigate('/admin/round-2')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      {/* Header */}
      <ExamHeader
        roundNumber={2}
        roundTitle="Python Code Debugging"
        formattedTime={formattedTime}
        isLowTime={isLowTime}
        warningsCount={currentParticipant.warningsCount}
        onSubmitClick={() => setIsConfirmModalOpen(true)}
      />

      {/* Main Grid: Left Problem Statement, Middle Monaco Editor, Right Test Cases */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr 340px',
          gap: '16px',
          maxWidth: '1680px',
          width: '100%',
          margin: '0 auto',
          padding: '16px 20px',
          flex: 1,
          height: 'calc(100vh - 68px)',
          overflow: 'hidden',
        }}
        className="debugging-layout-grid"
      >
        {/* Left Column: Problem Statement */}
        <aside
          className="glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#00f5a0' }}>
            <BookOpen size={18} />
            <h4 style={{ margin: 0, color: '#fff', fontSize: '1.05rem' }}>Problem Description</h4>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{activeProblem.title}</h3>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 245, 160, 0.1)',
                border: '1px solid rgba(0, 245, 160, 0.25)',
                color: '#00f5a0',
              }}
            >
              {activeProblem.difficulty}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#93c5fd',
              }}
            >
              {activeProblem.marks} Marks
            </span>
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.65',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              marginBottom: '20px',
            }}
          >
            {activeProblem.description}
          </div>

          <div
            style={{
              marginTop: 'auto',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(7, 11, 20, 0.7)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#00d9f5" style={{ flexShrink: 0 }} />
            <span>
              Modify the code in the center editor to resolve all logic bugs. Click "Run Code" to verify against test suites.
            </span>
          </div>
        </aside>

        {/* Center Column: Monaco Code Editor */}
        <main style={{ height: '100%' }}>
          <CodeEditorView
            code={code}
            onChange={(val) => setCode(val)}
            onResetCode={() => setCode(activeProblem.buggyCode)}
            onRunCode={handleRunCode}
            isRunning={isRunning}
          />
        </main>

        {/* Right Column: Test Case Panel */}
        <aside style={{ height: '100%' }}>
          <TestCasePanel
            testCases={activeProblem.testCases}
            results={executionResult ? executionResult.results : null}
            isRunning={isRunning}
            scoreAwarded={executionResult ? executionResult.scoreAwarded : undefined}
            maxScore={activeProblem.marks}
          />
        </aside>
      </div>

      {/* Warning Modal */}
      <WarningModal
        warning={activeWarningModal}
        onContinue={closeWarningModal}
      />

      {/* Disqualification Modal */}
      <DisqualificationModal
        isOpen={Boolean(currentParticipant.isDisqualified || currentParticipant.warningsCount >= 3)}
        reason={currentParticipant.disqualificationReason || 'Accumulated 3 proctoring infractions.'}
        roundNumber={2}
        onExit={() => onNavigate('/participant/dashboard')}
      />

      {/* Submission Confirmation Modal */}
      <SubmissionConfirmModal
        isOpen={isConfirmModalOpen}
        roundNumber={2}
        attemptedCount={code !== activeProblem.buggyCode ? 1 : 0}
        unansweredCount={code === activeProblem.buggyCode ? 1 : 0}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />

      <style>{`
        @media (max-width: 1200px) {
          .debugging-layout-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
};
