import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { DebuggingQuestion, TestCase } from '../../types';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { PlusCircle, Trash2, Edit3, Eye, Code2, Plus, Save, EyeOff } from 'lucide-react';

export const AdminRound2Page: React.FC = () => {
  const { debuggingQuestions, addDebuggingQuestion, updateDebuggingQuestion, deleteDebuggingQuestion } = useEvent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [buggyCode, setBuggyCode] = useState('');
  const [marks, setMarks] = useState<number>(100);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(3);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: `tc-${Date.now()}-1`, input: '5', expectedOutput: '25', isHidden: false, marks: 50 },
    { id: `tc-${Date.now()}-2`, input: '12', expectedOutput: '144', isHidden: true, marks: 50 },
  ]);
  const [previewProblem, setPreviewProblem] = useState<DebuggingQuestion | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDifficulty('Medium');
    setBuggyCode(`def calculate_square(n):\n    # TODO: Fix the calculation logic\n    return n + n\n\nif __name__ == '__main__':\n    import sys\n    n = int(sys.stdin.read().strip())\n    print(calculate_square(n))`);
    setMarks(100);
    setTimeLimitSeconds(3);
    setTestCases([
      { id: `tc-${Date.now()}-1`, input: '5', expectedOutput: '25', isHidden: false, marks: 50 },
      { id: `tc-${Date.now()}-2`, input: '12', expectedOutput: '144', isHidden: true, marks: 50 },
    ]);
    setEditingId(null);
    setError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: DebuggingQuestion) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setDifficulty(p.difficulty);
    setBuggyCode(p.buggyCode);
    setMarks(p.marks);
    setTimeLimitSeconds(p.timeLimitSeconds);
    setTestCases(p.testCases);
    setIsFormOpen(true);
  };

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      {
        id: `tc-${Date.now()}-${testCases.length + 1}`,
        input: '',
        expectedOutput: '',
        isHidden: false,
        marks: 20,
      },
    ]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, idx) => idx !== index));
  };

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: any) => {
    const updated = [...testCases];
    (updated[index] as any)[field] = value;
    setTestCases(updated);
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Problem Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Problem Description is required.');
      return;
    }
    if (!buggyCode.trim()) {
      setError('Buggy Python Code is required.');
      return;
    }
    if (testCases.length === 0) {
      setError('At least one test case is required.');
      return;
    }

    if (editingId) {
      updateDebuggingQuestion({
        id: editingId,
        roundId: 'round-2',
        title: title.trim(),
        description: description.trim(),
        difficulty,
        buggyCode,
        marks,
        timeLimitSeconds,
        testCases,
        status: 'active',
      });
    } else {
      addDebuggingQuestion({
        roundId: 'round-2',
        title: title.trim(),
        description: description.trim(),
        difficulty,
        buggyCode,
        marks,
        timeLimitSeconds,
        testCases,
        status: 'active',
      });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handlePreview = (p: DebuggingQuestion) => {
    setPreviewProblem(p);
    setIsPreviewOpen(true);
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Round 2 — Debugging Question Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Configure Python debugging challenges, provide buggy starting code, and construct test case suites.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <PlusCircle size={18} />
          Create Debugging Problem
        </button>
      </div>

      {/* Problem list */}
      {debuggingQuestions.length === 0 ? (
        <EmptyState
          title="No debugging problems configured"
          description="Round 2 currently has no active problems. Click 'Create Debugging Problem' above to configure a challenge with test cases."
          icon={<Code2 size={36} color="#00f5a0" />}
          actionText="Create First Problem"
          onAction={handleOpenAdd}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {debuggingQuestions.map((p) => (
            <div key={p.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0, 245, 160, 0.12)',
                        border: '1px solid rgba(0, 245, 160, 0.3)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#00f5a0',
                        fontWeight: 700,
                      }}
                    >
                      {p.difficulty}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#93c5fd' }}>
                      {p.marks} Total Marks
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      • {p.testCases.length} Test Cases ({p.testCases.filter((tc) => tc.isHidden).length} Hidden)
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                    {p.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.description}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span>Timeout: {p.timeLimitSeconds}s</span>
                    <span>•</span>
                    <span>Code lines: {p.buggyCode.split('\n').length}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handlePreview(p)} className="btn btn-outline btn-sm" title="Preview Problem">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => handleOpenEdit(p)} className="btn btn-secondary btn-sm" title="Edit Problem">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => deleteDebuggingQuestion(p.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} title="Delete Problem">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Debugging Challenge' : 'Create Python Debugging Problem'}
        maxWidth="760px"
      >
        <form onSubmit={handleSaveProblem}>
          {error && <div className="form-error" style={{ marginBottom: '14px' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="probTitle">Problem Title *</label>
              <input
                id="probTitle"
                type="text"
                className="form-input"
                placeholder="e.g. Reverse Linked List or Matrix Transposition Bug"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="probDiff">Difficulty</label>
              <select
                id="probDiff"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="probDesc">Problem Description *</label>
            <textarea
              id="probDesc"
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem requirements, expected algorithmic behavior, and constraints..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="probCode">
              Buggy Python Code (Pre-loaded in Participant Editor) *
            </label>
            <textarea
              id="probCode"
              className="form-textarea"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}
              rows={6}
              value={buggyCode}
              onChange={(e) => setBuggyCode(e.target.value)}
              placeholder="def solution():\n    # broken code here"
            />
          </div>

          {/* Test Cases Manager */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Test Cases ({testCases.length})
              </label>
              <button type="button" onClick={handleAddTestCase} className="btn btn-outline btn-sm">
                <Plus size={14} /> Add Test Case
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
              {testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  style={{
                    background: 'rgba(7, 11, 20, 0.7)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.5fr 1fr 100px 40px',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Input</div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Expected Output</div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                      placeholder="e.g. 25"
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Visibility</div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', marginTop: '6px' }}>
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) => handleTestCaseChange(idx, 'isHidden', e.target.checked)}
                      />
                      <span>Hidden</span>
                    </label>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Marks</div>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                      value={tc.marks}
                      onChange={(e) => handleTestCaseChange(idx, 'marks', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(idx)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '6px', color: '#ef4444', border: 'none', marginTop: '14px' }}
                      title="Remove Test Case"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Debugging Problem
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewProblem && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Problem Preview: ${previewProblem.title}`}
          maxWidth="680px"
        >
          <div style={{ padding: '6px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '16px', lineHeight: '1.6' }}>
              {previewProblem.description}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Buggy Python Code:</div>
              <pre
                style={{
                  background: '#090e1c',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: '#00f5a0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                }}
              >
                {previewProblem.buggyCode}
              </pre>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Test Suites:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {previewProblem.testCases.map((tc, i) => (
                  <div key={tc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <span>Case {i + 1} (Input: <code>{tc.input}</code>)</span>
                    <span style={{ color: tc.isHidden ? '#f59e0b' : '#00f5a0', fontSize: '0.78rem' }}>
                      {tc.isHidden ? 'Hidden (Concealed from student)' : `Public: Expected -> ${tc.expectedOutput}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsPreviewOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
