import { useState, useEffect } from 'react';
import { Session } from '../types';
import { storage } from '../utils/storage';

const SessionsPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  useEffect(() => {
    const savedSessions = storage.getSessions();
    setSessions(savedSessions);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 0.8) return 'hsl(var(--success))';
    if (score > 0.6) return 'hsl(var(--warning))';
    return 'hsl(var(--error))';
  };

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.setItem('research_sessions', JSON.stringify(updatedSessions));
      setSelectedSessions(prev => prev.filter(id => id !== sessionId));
    }
  };

  const compareHypotheses = () => {
    if (selectedSessions.length < 2) {
      alert('Please select at least 2 sessions to compare.');
      return;
    }

    const comparison = selectedSessions.map(sessionId => {
      const session = sessions.find(s => s.id === sessionId);
      return {
        projectName: session?.projectName,
        question: session?.question,
        score: session?.score,
        agentCount: session?.agents.length || 0,
        timestamp: session?.timestamp
      };
    });

    // Create a simple comparison view
    const comparisonWindow = window.open('', '_blank');
    if (comparisonWindow) {
      comparisonWindow.document.write(`
        <html>
          <head>
            <title>Session Comparison</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f5f5f5; }
              .score { font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Session Comparison</h1>
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Research Question</th>
                  <th>Score</th>
                  <th>Agents Used</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${comparison.map(item => `
                  <tr>
                    <td>${item.projectName}</td>
                    <td>${item.question}</td>
                    <td class="score">${item.score}</td>
                    <td>${item.agentCount}</td>
                    <td>${new Date(item.timestamp!).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
    }
  };

  const loadSession = (session: Session) => {
    if (confirm('Load this session as your current research context?')) {
      storage.setCurrentQuestion(session.question);
      alert('Session loaded! You can now continue working on this research question.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            📁 Research Sessions
          </h1>
          <p style={{ fontSize: '18px', color: 'hsl(var(--text-muted))' }}>
            View and manage your saved research sessions.
          </p>
        </div>
        
        {selectedSessions.length > 0 && (
          <button 
            onClick={compareHypotheses}
            className="btn btn-primary"
          >
            🔍 Compare {selectedSessions.length} Sessions
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ marginBottom: '16px' }}>No Sessions Yet</h3>
          <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '24px' }}>
            Start researching to create your first session. Sessions are automatically saved when you run agents on the dashboard.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </a>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '24px' }}>
            <p className="text-muted">
              Found {sessions.length} saved session{sessions.length !== 1 ? 's' : ''}. 
              Click on sessions to select them for comparison.
            </p>
          </div>

          <div className="grid grid-cols-1" style={{ gap: '16px' }}>
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selectedSessions.includes(session.id) 
                    ? '2px solid hsl(var(--primary))' 
                    : '1px solid hsl(var(--border))',
                  background: selectedSessions.includes(session.id) 
                    ? 'hsl(var(--primary) / 0.05)' 
                    : 'hsl(var(--surface))'
                }}
                onClick={() => toggleSessionSelection(session.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => toggleSessionSelection(session.id)}
                        style={{ marginRight: '12px' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        {session.projectName}
                      </h3>
                    </div>
                    
                    <p style={{ 
                      margin: '0 0 12px 0', 
                      color: 'hsl(var(--text-muted))',
                      lineHeight: '1.5'
                    }}>
                      {session.question}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px',
                      fontSize: '14px'
                    }}>
                      <span>
                        <strong>Score:</strong> 
                        <span style={{ 
                          color: getScoreColor(session.score),
                          fontWeight: '600',
                          marginLeft: '4px'
                        }}>
                          {(session.score * 100).toFixed(1)}%
                        </span>
                      </span>
                      <span>
                        <strong>Agents:</strong> {session.agents.length}
                      </span>
                      <span className="text-muted">
                        {formatDate(session.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSession(session);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                    >
                      📂 Load
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="btn btn-secondary"
                      style={{ 
                        padding: '8px 12px', 
                        fontSize: '14px',
                        color: 'hsl(var(--error))',
                        border: '1px solid hsl(var(--error) / 0.3)'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tips Section */}
      <div className="card" style={{ marginTop: '40px', background: 'hsl(var(--background))' }}>
        <h3 style={{ marginBottom: '16px' }}>💡 Session Management Tips</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Load Sessions:</strong> Click "Load" to continue working on a previous research question</li>
          <li><strong>Compare Sessions:</strong> Select multiple sessions to analyze different approaches</li>
          <li><strong>Score Meaning:</strong> Higher scores indicate more confident agent results</li>
          <li><strong>Agent Count:</strong> Shows how thoroughly each topic was researched</li>
          <li><strong>Data Persistence:</strong> Sessions are stored locally in your browser</li>
        </ul>
      </div>
    </div>
  );
};

export default SessionsPage;
