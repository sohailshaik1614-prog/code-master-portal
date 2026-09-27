import React, { useState } from 'react';
import { TestCase, TestCaseResult } from '../../types';
import { CheckCircle2, XCircle, EyeOff, Terminal, Clock } from 'lucide-react';

interface TestCasePanelProps {
  testCases: TestCase[];
  results: TestCaseResult[] | null;
  isRunning: boolean;
  scoreAwarded?: number;
  maxScore?: number;
  isServiceUnavailable?: boolean;
}

export const TestCasePanel: React.FC<TestCasePanelProps> = ({
  testCases,
  results,
  isRunning,
  scoreAwarded,
  maxScore,
  isServiceUnavailable,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const passedCount = results ? results.filter((r) => r.passed).length : 0;
  const totalCount = testCases.length;

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
      {/* Panel Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="#00d9f5" />
          <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Test Results & Cases</h4>
        </div>

        {results && results.length > 0 && !isServiceUnavailable && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: passedCount === totalCount ? '#10b981' : '#f59e0b',
                background: passedCount === totalCount ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: passedCount === totalCount ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              Passed: {passedCount}/{totalCount}
            </span>

            {scoreAwarded !== undefined && maxScore !== undefined && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#00f5a0',
                }}
              >
                Score: {scoreAwarded}/{maxScore}
              </span>
            )}
          </div>
        )}
      </div>

      {isRunning ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '3px solid rgba(0, 245, 160, 0.2)',
              borderTopColor: '#00f5a0',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>Executing test cases against sandbox...</span>
        </div>
      ) : isServiceUnavailable ? (
        <div
          style={{
            padding: '32px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            textAlign: 'center',
            margin: 'auto 0',
          }}
        >
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>
            Code execution service is temporarily unavailable.
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Please try again.
          </div>
        </div>
      ) : testCases.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '24px 0', textAlign: 'center' }}>
          No test cases configured for this debugging problem.
        </div>
      ) : (
        <>
          {/* Test Case Select Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
            {testCases.map((tc, idx) => {
              const res = results ? results.find((r) => r.testCaseId === tc.id) : null;
              const isPassed = res ? res.passed : null;

              return (
                <button
                  key={tc.id}
                  onClick={() => setActiveTab(idx)}
                  className="btn btn-sm"
                  style={{
                    background: activeTab === idx ? 'rgba(0, 217, 245, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                    borderColor: activeTab === idx ? '#00d9f5' : 'var(--border-subtle)',
                    color: activeTab === idx ? '#fff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                  }}
                >
                  {isPassed === true && <CheckCircle2 size={13} color="#10b981" />}
                  {isPassed === false && <XCircle size={13} color="#ef4444" />}
                  {tc.isHidden && isPassed === null && <EyeOff size={13} color="var(--text-muted)" />}
                  <span>Case {idx + 1}</span>
                  {tc.isHidden && <span style={{ fontSize: '0.68rem', color: '#f59e0b' }}>(Hidden)</span>}
                </button>
              );
            })}
          </div>

          {/* Active Test Case Detail */}
          {testCases[activeTab] && (
            <div
              style={{
                background: 'rgba(7, 11, 20, 0.85)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                flex: 1,
                overflowY: 'auto',
              }}
            >
              {(() => {
                const tc = testCases[activeTab];
                const res = results ? results.find((r) => r.testCaseId === tc.id) : null;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Status Banner */}
                    {res && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: res.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          border: res.passed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          color: res.passed ? '#10b981' : '#ef4444',
                          fontWeight: 700,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {res.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          <span>{res.passed ? 'Test Case Passed' : 'Test Case Failed'}</span>
                        </div>
                        {res.executionTimeMs && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <Clock size={13} />
                            <span>{res.executionTimeMs}ms</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Input */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Input
                      </div>
                      <pre
                        style={{
                          background: 'rgba(15, 23, 42, 0.9)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          color: '#e2e8f0',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {tc.input}
                      </pre>
                    </div>

                    {/* Expected Output (Hidden guard) */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Expected Output
                      </div>
                      <pre
                        style={{
                          background: 'rgba(15, 23, 42, 0.9)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          color: tc.isHidden ? '#f59e0b' : '#00f5a0',
                          fontStyle: tc.isHidden ? 'italic' : 'normal',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {tc.isHidden ? '[HIDDEN TEST CASE - OUTPUT CONCEALED]' : tc.expectedOutput}
                      </pre>
                    </div>

                    {/* Actual Output (if run) */}
                    {res && (
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Your Output
                        </div>
                        <pre
                          style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            color: res.passed ? '#00f5a0' : '#f87171',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {res.actualOutput || 'No output produced'}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
