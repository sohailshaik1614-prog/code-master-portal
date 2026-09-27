import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { MCQQuestion } from '../../types';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { PlusCircle, Trash2, Edit3, Eye, HelpCircle, Save, CheckCircle } from 'lucide-react';

export const AdminRound1Page: React.FC = () => {
  const { mcqQuestions, addMCQQuestion, updateMCQQuestion, deleteMCQQuestion } = useEvent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [marks, setMarks] = useState<number>(4);
  const [negativeMarks, setNegativeMarks] = useState<number>(1);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [previewQuestion, setPreviewQuestion] = useState<MCQQuestion | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setMarks(4);
    setNegativeMarks(1);
    setStatus('active');
    setEditingId(null);
    setError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (q: MCQQuestion) => {
    setEditingId(q.id);
    setQuestionText(q.questionText);
    setOptionA(q.optionA);
    setOptionB(q.optionB);
    setOptionC(q.optionC);
    setOptionD(q.optionD);
    setCorrectAnswer(q.correctAnswer);
    setMarks(q.marks);
    setNegativeMarks(q.negativeMarks);
    setStatus(q.status);
    setIsFormOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError('Question text is required.');
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setError('All 4 options (A, B, C, D) are required.');
      return;
    }

    if (editingId) {
      updateMCQQuestion({
        id: editingId,
        roundId: 'round-1',
        questionNumber: mcqQuestions.findIndex((q) => q.id === editingId) + 1,
        questionText: questionText.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctAnswer,
        marks,
        negativeMarks,
        status,
      });
    } else {
      addMCQQuestion({
        roundId: 'round-1',
        questionNumber: mcqQuestions.length + 1,
        questionText: questionText.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctAnswer,
        marks,
        negativeMarks,
        status,
      });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handlePreview = (q: MCQQuestion) => {
    setPreviewQuestion(q);
    setIsPreviewOpen(true);
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Round 1 — MCQ Question Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Create and edit objective algorithmic questions. The correct answer is strictly hidden from participants.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <PlusCircle size={18} />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      {mcqQuestions.length === 0 ? (
        <EmptyState
          title="No questions added yet"
          description="The question bank for Round 1 is currently empty. Click 'Add Question' above to create real competition questions."
          icon={<HelpCircle size={36} color="#00d9f5" />}
          actionText="Create First Question"
          onAction={handleOpenAdd}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mcqQuestions.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00d9f5', fontWeight: 700 }}>
                      Q{idx + 1}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#10b981',
                      }}
                    >
                      +{q.marks} Marks
                    </span>
                    {q.negativeMarks > 0 && (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#ef4444',
                        }}
                      >
                        -{q.negativeMarks} Marks
                      </span>
                    )}
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0, 245, 160, 0.1)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: '#00f5a0',
                      }}
                    >
                      Correct Key: {q.correctAnswer}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '12px', lineHeight: '1.5' }}>
                    {q.questionText}
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div><strong style={{ color: q.correctAnswer === 'A' ? '#00f5a0' : 'var(--text-muted)' }}>A:</strong> {q.optionA}</div>
                    <div><strong style={{ color: q.correctAnswer === 'B' ? '#00f5a0' : 'var(--text-muted)' }}>B:</strong> {q.optionB}</div>
                    <div><strong style={{ color: q.correctAnswer === 'C' ? '#00f5a0' : 'var(--text-muted)' }}>C:</strong> {q.optionC}</div>
                    <div><strong style={{ color: q.correctAnswer === 'D' ? '#00f5a0' : 'var(--text-muted)' }}>D:</strong> {q.optionD}</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handlePreview(q)} className="btn btn-outline btn-sm" title="Preview Participant View">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => handleOpenEdit(q)} className="btn btn-secondary btn-sm" title="Edit Question">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => deleteMCQQuestion(q.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} title="Delete Question">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit MCQ Question' : 'Add New MCQ Question'}
        maxWidth="640px"
      >
        <form onSubmit={handleSaveQuestion}>
          {error && <div className="form-error" style={{ marginBottom: '14px' }}>{error}</div>}

          {/* Question Text */}
          <div className="form-group">
            <label className="form-label" htmlFor="qText">Question Text *</label>
            <textarea
              id="qText"
              className="form-textarea"
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What is the time complexity of searching in a balanced AVL tree?"
            />
          </div>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="optA">Option A *</label>
              <input
                id="optA"
                type="text"
                className="form-input"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A text"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="optB">Option B *</label>
              <input
                id="optB"
                type="text"
                className="form-input"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B text"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="optC">Option C *</label>
              <input
                id="optC"
                type="text"
                className="form-input"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C text"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="optD">Option D *</label>
              <input
                id="optD"
                type="text"
                className="form-input"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Option D text"
              />
            </div>
          </div>

          {/* Correct Answer & Marks Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="correctSelect">Correct Answer *</label>
              <select
                id="correctSelect"
                className="form-select"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value as any)}
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="qMarks">Marks (+)</label>
              <input
                id="qMarks"
                type="number"
                min="1"
                className="form-input"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="negMarks">Negative Marks (-)</label>
              <input
                id="negMarks"
                type="number"
                min="0"
                className="form-input"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Participant View Preview Modal */}
      {previewQuestion && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Participant View Preview (Answer Key Concealed)"
          maxWidth="580px"
        >
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#00f5a0' }}>
                +{previewQuestion.marks} MARKS • -{previewQuestion.negativeMarks} NEGATIVE
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Correct answer is hidden from student
              </span>
            </div>

            <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '20px', lineHeight: '1.6' }}>
              {previewQuestion.questionText}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {['A', 'B', 'C', 'D'].map((key) => {
                const optText = (previewQuestion as any)[`option${key}`];
                return (
                  <div key={key} className="option-card" style={{ cursor: 'default' }}>
                    <div className="option-letter">{key}</div>
                    <div style={{ fontSize: '0.92rem' }}>{optText}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsPreviewOpen(false)} className="btn btn-secondary">
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
