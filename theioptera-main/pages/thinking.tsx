import { useState, useEffect } from 'react';
import { ThinkingResult } from '../types';
import { storage } from '../utils/storage';

const ThinkingPage = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const question = storage.getCurrentQuestion();
    setCurrentQuestion(question);
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const question = storage.getCurrentQuestion() || 'default';
      const res = await fetch(`/api/thinking?q=${encodeURIComponent(question)}`);
      const data: ThinkingResult = await res.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate Socratic questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = () => {
    if (!reflection.trim()) {
      alert('Please write your reflection first.');
      return;
    }

    const savedReflections = JSON.parse(localStorage.getItem('reflections') || '[]');
    const newReflection = {
      id: Date.now().toString(),
      question: currentQuestion,
      reflection: reflection.trim(),
      timestamp: new Date().toISOString(),
      socraticQuestions: questions
    };

    savedReflections.unshift(newReflection);
    localStorage.setItem('reflections', JSON.stringify(savedReflections));
    
    alert('Reflection saved successfully!');
    setReflection('');
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
        🤔 Socratic Thinking
      </h1>
      
      <p style={{ fontSize: '18px', color: 'hsl(var(--text-muted))', marginBottom: '32px' }}>
        Challenge your assumptions and deepen your understanding through Socratic questioning.
      </p>

      {currentQuestion ? (
        <div className="card" style={{ background: 'hsl(var(--primary) / 0.05)', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '8px', color: 'hsl(var(--primary))' }}>Research Question:</h3>
          <p style={{ fontSize: '16px', margin: 0 }}>{currentQuestion}</p>
        </div>
      ) : (
        <div className="card" style={{ background: 'hsl(var(--warning) / 0.05)', marginBottom: '32px' }}>
          <p style={{ margin: 0, color: 'hsl(var(--warning))' }}>
            ⚠️ No research question set. <a href="/" style={{ color: 'hsl(var(--primary))' }}>Go back to set one</a>.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Socratic Questions Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Socratic Questions</h2>
            <button 
              onClick={generateQuestions} 
              disabled={loading || !currentQuestion}
              className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
            >
              {loading ? (
                <>
                  <span className="spinner mr-2"></span>
                  Generating...
                </>
              ) : (
                '🔄 Generate Questions'
              )}
            </button>
          </div>

          {questions.length > 0 ? (
            <div className="card">
              <h3 style={{ marginBottom: '16px', color: 'hsl(var(--primary))' }}>
                Reflect on these questions:
              </h3>
              <ol style={{ paddingLeft: '20px' }}>
                {questions.map((question, index) => (
                  <li key={index} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                    {question}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
              <p>Click "Generate Questions" to get Socratic questions for your research.</p>
            </div>
          )}
        </div>

        {/* Reflection Section */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            Your Reflection
          </h2>

          <div className="card">
            <div className="form-group">
              <label htmlFor="reflection" className="form-label">
                Write your thoughts and insights:
              </label>
              <textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Consider the Socratic questions above and reflect on your research approach, assumptions, and potential biases..."
                className="form-textarea"
                rows={12}
              />
            </div>

            <button 
              onClick={saveReflection}
              disabled={!reflection.trim()}
              className="btn btn-success"
              style={{ width: '100%' }}
            >
              💾 Save Reflection
            </button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card" style={{ marginTop: '40px', background: 'hsl(var(--background))' }}>
        <h3 style={{ marginBottom: '16px' }}>💡 Tips for Effective Reflection</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Question your underlying assumptions about the research topic</li>
          <li>Consider alternative explanations for the phenomena you're studying</li>
          <li>Think about potential biases in your research approach</li>
          <li>Examine the quality and recency of your sources</li>
          <li>Consider ethical implications of your research</li>
          <li>Think about practical applications and limitations</li>
        </ul>
      </div>
    </div>
  );
};

export default ThinkingPage;
