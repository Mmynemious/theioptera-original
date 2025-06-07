import { useEffect, useState } from 'react';
import AgentCard from '../components/AgentCard';
import { AgentResult } from '../types';
import { storage } from '../utils/storage';

const DashboardPage = () => {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<AgentResult[]>([]);

  useEffect(() => {
    const currentQuestion = storage.getCurrentQuestion();
    setQuestion(currentQuestion);
  }, []);

  const agents = [
    { title: 'Thesis Agent', endpoint: '/api/thesis', description: 'Generate research thesis and objectives' },
    { title: 'Search Agent', endpoint: '/api/search', description: 'Find relevant scientific literature' },
    { title: 'Summarize Agent', endpoint: '/api/summarize', description: 'Summarize key findings and insights' },
    { title: 'Trend Agent', endpoint: '/api/trend', description: 'Identify research trends and patterns' },
    { title: 'Hypothesis Agent', endpoint: '/api/hypothesis', description: 'Generate testable hypotheses' },
    { title: 'Evaluate Agent', endpoint: '/api/evaluate', description: 'Assess hypothesis validity and feasibility' },
    { title: 'Map Agent', endpoint: '/api/map', description: 'Create research workflow visualization' },
    { title: 'Thinking Agent', endpoint: '/api/thinking', description: 'Provide Socratic questioning for reflection' },
    { title: 'Evidence Agent', endpoint: '/api/evidence', description: 'Find supporting and opposing evidence' }
  ];

  const handleAgentResult = (result: AgentResult) => {
    setResults(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(r => r.input_used === result.input_used);
      if (existingIndex >= 0) {
        updated[existingIndex] = result;
      } else {
        updated.push(result);
      }
      return updated;
    });
  };

  const saveSession = () => {
    if (results.length === 0) {
      alert('No results to save. Please run some agents first.');
      return;
    }

    const projectName = prompt('Enter a name for this research session:');
    if (!projectName) return;

    const session = {
      id: Date.now().toString(),
      projectName,
      question,
      score: Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100) / 100,
      timestamp: new Date().toISOString(),
      agents: results
    };

    storage.addSession(session);
    alert('Session saved successfully!');
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
          Research Dashboard
        </h1>
        
        {question ? (
          <div className="card" style={{ background: 'hsl(var(--primary) / 0.05)' }}>
            <h3 style={{ marginBottom: '8px', color: 'hsl(var(--primary))' }}>Current Research Question:</h3>
            <p style={{ fontSize: '16px', margin: 0 }}>{question}</p>
          </div>
        ) : (
          <div className="card" style={{ background: 'hsl(var(--warning) / 0.05)' }}>
            <p style={{ margin: 0, color: 'hsl(var(--warning))' }}>
              ⚠️ No research question set. <a href="/" style={{ color: 'hsl(var(--primary))' }}>Go back to set one</a>.
            </p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Session Results</h2>
            <button onClick={saveSession} className="btn btn-success">
              💾 Save Session
            </button>
          </div>
          
          <div className="card">
            <p><strong>Completed Agents:</strong> {results.length}</p>
            <p><strong>Average Confidence:</strong> {
              Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100)
            }%</p>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
        Available Agents
      </h2>

      <div className="grid grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.title}>
            <AgentCard
              title={agent.title}
              endpoint={agent.endpoint}
              onRun={handleAgentResult}
            />
            <p className="text-muted text-sm" style={{ marginTop: '8px', textAlign: 'center' }}>
              {agent.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div className="card" style={{ background: 'hsl(var(--background))' }}>
          <h3 style={{ marginBottom: '16px' }}>Need Help?</h3>
          <p style={{ marginBottom: '16px' }}>
            Start with the <strong>Thesis Agent</strong> to define your research objectives, 
            then use <strong>Search Agent</strong> to find relevant literature. 
            The <strong>Map Agent</strong> can help visualize your research workflow.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="/thinking" className="btn btn-secondary">🤔 Socratic Thinking</a>
            <a href="/evidence" className="btn btn-secondary">📊 Evidence Analysis</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
