import React from 'react';
import { MCQQuestion } from '../../types';
import { ChevronLeft, ChevronRight, Bookmark, RotateCcw } from 'lucide-react';

interface MCQQuestionViewProps {
  question: MCQQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  isMarkedForReview: boolean;
  disabled?: boolean;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  onClearAnswer: () => void;
  onToggleReview: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const MCQQuestionView: React.FC<MCQQuestionViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  disabled = false,
  onSelectOption,
  onClearAnswer,
  onToggleReview,
  onPrev,
  onNext,
}) => {
  const options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }> = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ];

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px',
        padding: '32px',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Question Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#00f5a0',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              QUESTION {currentIndex + 1} OF {totalQuestions}
            </span>
            {isMarkedForReview && (
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--color-warning)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Marked for Review
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#10b981',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              +{question.marks} MARKS
            </span>
            {question.negativeMarks > 0 && (
              <span
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#ef4444',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                -{question.negativeMarks} MARKS
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div
          style={{
            fontSize: '1.15rem',
            fontWeight: 500,
            lineHeight: '1.65',
            color: '#f8fafc',
            marginBottom: '28px',
          }}
        >
          {question.questionText}
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {options.map(({ key, text }) => {
            const isSelected = selectedAnswer === key;
            return (
              <div
                key={key}
                onClick={() => !disabled && onSelectOption(key)}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  pointerEvents: disabled ? 'none' : 'auto',
                }}
              >
                <div className="option-letter">{key}</div>
                <div style={{ fontSize: '0.98rem', color: isSelected ? '#ffffff' : 'var(--text-primary)', flex: 1 }}>
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onToggleReview}
            disabled={disabled}
            className={`btn btn-sm ${isMarkedForReview ? 'btn-warning' : 'btn-outline'}`}
          >
            <Bookmark size={15} />
            {isMarkedForReview ? 'Unmark Review' : 'Mark for Review'}
          </button>

          {selectedAnswer && (
            <button
              onClick={onClearAnswer}
              disabled={disabled}
              className="btn btn-outline btn-sm"
              title="Clear selected option"
            >
              <RotateCcw size={15} />
              Clear Answer
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onPrev}
            disabled={disabled || currentIndex === 0}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            onClick={onNext}
            disabled={disabled || currentIndex === totalQuestions - 1}
            className="btn btn-primary btn-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
