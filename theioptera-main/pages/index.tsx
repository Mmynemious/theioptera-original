import { useState } from 'react';
import { useRouter } from 'next/router';
import { storage } from '../utils/storage';

const HomePage = () => {
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Store the question for context in agents
      storage.setCurrentQuestion(question.trim());
      // Navigate to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '700', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🦋 Theioptera
        </h1>
        
        <p style={{ 
          fontSize: '20px', 
          color: 'hsl(var(--text-muted))', 
          marginBottom: '16px',
          lineHeight: '1.6'
        }}>
          Vision that gives science wings
        </p>
        
        <p style={{ 
          fontSize: '18px', 
          color: 'hsl(var(--text-muted))', 
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          A modular research assistant for biomedical hypothesis generation. 
          Ask your research question and let our specialized agents help you explore.
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <div className="form-group">
            <label htmlFor="question" className="form-label" style={{ fontSize: '18px' }}>
              What would you like to research?
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What are the potential therapeutic targets for Alzheimer's disease using AI-driven drug discovery?"
              className="form-textarea"
              rows={4}
              style={{ fontSize: '16px' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ fontSize: '18px', padding: '16px 32px' }}
          >
            Start Research →
          </button>
        </form>

        <div className="grid grid-cols-3" style={{ marginTop: '60px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>Search & Analyze</h3>
            <p className="text-muted">Find relevant papers and extract key insights</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
            <h3 style={{ marginBottom: '8px' }}>Generate Hypotheses</h3>
            <p className="text-muted">Create testable hypotheses from research data</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧪</div>
            <h3 style={{ marginBottom: '8px' }}>Evaluate Evidence</h3>
            <p className="text-muted">Assess supporting and opposing evidence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
