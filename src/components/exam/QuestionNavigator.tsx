import React from 'react';
import { Check, Bookmark, Circle } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, string>;
  questionIds: string[];
  reviewStatus: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  reviewStatus,
  onSelectQuestion,
}) => {
  const attemptedCount = Object.keys(answers).length;
  const reviewCount = Object.values(reviewStatus).filter(Boolean).length;
  const unansweredCount = totalQuestions - attemptedCount;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px',
      }}
    >
      <h4 style={{ marginBottom: '16px', fontSize: '1rem', color: '#fff' }}>
        Question Navigator
      </h4>

      {/* Grid of question buttons */}
      <div
        className="nav-grid"
        style={{
          maxHeight: '340px',
          overflowY: 'auto',
          paddingRight: '4px',
          marginBottom: '20px',
        }}
      >
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const qId = questionIds[index];
          const isAttempted = Boolean(answers[qId]);
          const isReview = Boolean(reviewStatus[qId]);
          const isCurrent = index === currentIndex;

          let itemClass = 'nav-grid-item';
          if (isCurrent) itemClass += ' current';
          else if (isReview) itemClass += ' review';
          else if (isAttempted) itemClass += ' attempted';

          return (
            <button
              key={index}
              onClick={() => onSelectQuestion(index)}
              className={itemClass}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span>{index + 1}</span>
              {isAttempted && !isReview && <Check size={11} />}
              {isReview && <Bookmark size={11} />}
            </button>
          );
        })}
      </div>

      {/* Status Legend & Counts */}
      <div
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontSize: '0.82rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Attempted</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
            {attemptedCount}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>Marked for Review</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
            {reviewCount}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Circle size={8} />
            <span>Unanswered</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
            {unansweredCount}
          </span>
        </div>
      </div>
    </div>
  );
};
