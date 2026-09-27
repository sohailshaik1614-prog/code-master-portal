import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { useExamTimer } from '../../hooks/useExamTimer';
import { useAntiCheat } from '../../hooks/useAntiCheat';
import { ExamHeader } from '../../components/exam/ExamHeader';
import { QuestionNavigator } from '../../components/exam/QuestionNavigator';
import { MCQQuestionView } from '../../components/exam/MCQQuestionView';
import { WarningModal } from '../../components/exam/WarningModal';
import { DisqualificationModal } from '../../components/exam/DisqualificationModal';
import { SubmissionConfirmModal } from '../../components/exam/SubmissionConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submissionService } from '../../services/submissionService';

interface Round1MCQPageProps {
  onNavigate: (path: string) => void;
}

export const Round1MCQPage: React.FC<Round1MCQPageProps> = ({ onNavigate }) => {
  const {
    currentParticipant,
    eventSchedule,
    mcqQuestions,
    submitRound1,
    activeWarningModal,
    closeWarningModal,
  } = useEvent();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [reviewStatus, setReviewStatus] = useState<Record<string, boolean>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ score: number; maxScore: number } | null>(null);

  // Auto-submit handler when timer reaches 0
  const handleTimeExpired = () => {
    if (!isSubmitted) {
      const res = submitRound1(answers, true);
      setSubmissionResult(res);
      setIsSubmitted(true);
    }
  };

  // Exam Countdown Timer
  const { formattedTime, isLowTime } = useExamTimer({
    initialMinutes: eventSchedule.round1DurationMinutes || 60,
    onTimeExpired: handleTimeExpired,
    isRunning: !isSubmitted && !currentParticipant?.isDisqualified,
  });

  // Anti-Cheat Monitoring
  useAntiCheat({
    enabled: !isSubmitted && !currentParticipant?.isDisqualified,
    roundNumber: 1,
    onDisqualified: () => {
      // Disqualification handled via context
    },
  });

  // Submission Confirm Action
  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    const res = submitRound1(answers, false);
    setSubmissionResult(res);
    setIsSubmitted(true);
    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch {
      // confetti fallback
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
  if (currentParticipant.round1Status === 'Completed' && !isSubmitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <CheckCircle2 size={48} color="#00f5a0" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Round 1 Already Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
            Your assessment has been evaluated. Your official score is{' '}
            <strong style={{ color: '#00f5a0', fontSize: '1.1rem' }}>{currentParticipant.round1Score} marks</strong>.
          </p>
          <button onClick={() => onNavigate('/participant/dashboard')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Submission Success Splash
  if (isSubmitted && submissionResult) {
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

          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}>Assessment Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
            Round 1 (MCQ Challenge) has been successfully recorded with authoritative timestamp.
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
              Round 1 Score
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: '#00f5a0' }}>
              {submissionResult.score} / {submissionResult.maxScore}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {currentParticipant.status === 'Round 2 Eligible' ? '✓ Qualified for Round 2 Python Debugging' : 'Round 1 Completed'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => onNavigate('/participant/dashboard')} className="btn btn-primary">
              Return to Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state if admin hasn't created questions yet
  if (mcqQuestions.length === 0) {
    return (
      <div className="exam-container">
        <ExamHeader
          roundNumber={1}
          roundTitle="Core CS & Algorithmic MCQ"
          formattedTime={formattedTime}
          isLowTime={isLowTime}
          warningsCount={currentParticipant.warningsCount}
          onSubmitClick={() => setIsConfirmModalOpen(true)}
        />
        <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px', width: '100%' }}>
          <EmptyState
            title="No questions currently available"
            description="The assessment questions have not been published by event coordinators yet. Questions created in the Admin Portal will dynamically populate here."
            icon={<HelpCircle size={36} color="#00d9f5" />}
            actionText="Go to Admin Portal to Add Questions"
            onAction={() => onNavigate('/admin/round-1')}
          />
        </div>

        {/* Warning Modal (Warnings 1/3 and 2/3) */}
        <WarningModal
          warning={activeWarningModal}
          onContinue={closeWarningModal}
        />

        {/* Disqualification Modal (Warning 3/3) */}
        <DisqualificationModal
          isOpen={Boolean(currentParticipant.isDisqualified || currentParticipant.warningsCount >= 3)}
          reason={currentParticipant.disqualificationReason || 'Accumulated 3 proctoring infractions.'}
          roundNumber={1}
          onExit={() => onNavigate('/participant/dashboard')}
        />
      </div>
    );
  }

  const currentQ = mcqQuestions[currentIndex];
  const questionIds = mcqQuestions.map((q) => q.id);
  const attemptedCount = Object.keys(answers).length;
  const unansweredCount = mcqQuestions.length - attemptedCount;
  const reviewCount = Object.values(reviewStatus).filter(Boolean).length;

  return (
    <div className="exam-container">
      {/* Distraction-Free Header */}
      <ExamHeader
        roundNumber={1}
        roundTitle="Core CS & Algorithmic MCQ"
        formattedTime={formattedTime}
        isLowTime={isLowTime}
        warningsCount={currentParticipant.warningsCount}
        totalQuestions={mcqQuestions.length}
        currentIndex={currentIndex}
        disabled={Boolean(currentParticipant.isDisqualified || currentParticipant.warningsCount >= 3)}
        onSubmitClick={() => setIsConfirmModalOpen(true)}
      />

      {/* Main Exam Interface Body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '24px',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '24px',
          flex: 1,
        }}
        className="exam-body-grid"
      >
        {/* Left Side: Question Navigator */}
        <aside>
          <QuestionNavigator
            totalQuestions={mcqQuestions.length}
            currentIndex={currentIndex}
            answers={answers}
            questionIds={questionIds}
            reviewStatus={reviewStatus}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </aside>

        {/* Center: MCQ Question & Options */}
        <main>
          <MCQQuestionView
            question={currentQ}
            currentIndex={currentIndex}
            totalQuestions={mcqQuestions.length}
            selectedAnswer={answers[currentQ.id]}
            isMarkedForReview={Boolean(reviewStatus[currentQ.id])}
            disabled={Boolean(currentParticipant.isDisqualified || currentParticipant.warningsCount >= 3)}
            onSelectOption={(opt) => {
              if (currentParticipant.isDisqualified || currentParticipant.warningsCount >= 3) return;
              setAnswers({ ...answers, [currentQ.id]: opt });
              if (currentParticipant?.id) {
                submissionService.saveMCQAnswer(currentParticipant.id, 1, currentQ.id, opt);
              }
            }}
            onClearAnswer={() => {
              const nextAns = { ...answers };
              delete nextAns[currentQ.id];
              setAnswers(nextAns);
            }}
            onToggleReview={() => setReviewStatus({ ...reviewStatus, [currentQ.id]: !reviewStatus[currentQ.id] })}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(mcqQuestions.length - 1, prev + 1))}
          />
        </main>
      </div>

      {/* Warning Modal (Warnings 1/3 and 2/3) */}
      <WarningModal
        warning={activeWarningModal}
        onContinue={closeWarningModal}
      />

      {/* Disqualification Modal (Warning 3/3) */}
      <DisqualificationModal
        isOpen={Boolean(currentParticipant.isDisqualified || currentParticipant.warningsCount >= 3)}
        reason={currentParticipant.disqualificationReason || 'Accumulated 3 proctoring infractions.'}
        roundNumber={1}
        onExit={() => onNavigate('/participant/dashboard')}
      />

      {/* Submit Confirmation Modal */}
      <SubmissionConfirmModal
        isOpen={isConfirmModalOpen}
        roundNumber={1}
        attemptedCount={attemptedCount}
        unansweredCount={unansweredCount}
        reviewCount={reviewCount}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />

      <style>{`
        @media (max-width: 900px) {
          .exam-body-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
