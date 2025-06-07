import { useState } from 'react';
import { AgentResult } from '../types';
import { storage } from '../utils/storage';

interface AgentCardProps {
  title: string;
  endpoint: string;
  onRun?: (result: AgentResult) => void;
}

const AgentCard = ({ title, endpoint, onRun }: AgentCardProps) => {
  const [data, setData] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get status from localStorage
  const agentStatus = storage.getAgentStatus();
  const status = agentStatus[title] || 'idle';

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'error':
        return '⚠️';
      default:
        return '⭕';
    }
  };

  const runAgent = async () => {
    setLoading(true);
    setError(null);
    storage.setAgentStatus(title, 'pending');

    try {
      const question = storage.getCurrentQuestion() || 'default';
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(question)}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      setData(json);
      storage.setAgentStatus(title, 'completed');
      
      if (onRun) {
        onRun(json);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      storage.setAgentStatus(title, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatConfidence = (confidence: number) => {
    return (confidence * 100).toFixed(1);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <span className="status-icon">{getStatusIcon()}</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
      </div>

      <button
        onClick={runAgent}
        disabled={loading}
        className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
        style={{ marginBottom: '16px', width: '100%' }}
      >
        {loading ? (
          <>
            <span className="spinner mr-2"></span>
            Running...
          </>
        ) : (
          'Run Agent'
        )}
      </button>

      {error && (
        <div style={{
          background: 'hsl(var(--error) / 0.1)',
          border: '1px solid hsl(var(--error) / 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: 'hsl(var(--error))'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Result:</strong>
            <div style={{
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              padding: '12px',
              marginTop: '8px',
              fontSize: '14px'
            }}>
              {data.result}
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div>
              <strong>Confidence:</strong>
              <div style={{ 
                fontSize: '18px', 
                color: data.confidence > 0.7 ? 'hsl(var(--success))' : 
                       data.confidence > 0.4 ? 'hsl(var(--warning))' : 'hsl(var(--error))',
                fontWeight: '600'
              }}>
                {formatConfidence(data.confidence)}%
              </div>
            </div>
            
            <div>
              <strong>Input:</strong>
              <div className="text-sm text-muted" style={{ marginTop: '4px' }}>
                {data.input_used}
              </div>
            </div>
          </div>

          {data.warnings && data.warnings.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Warnings:</strong>
              <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                {data.warnings.map((warning, index) => (
                  <li key={index} style={{ color: 'hsl(var(--warning))' }}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.sources && data.sources.length > 0 && (
            <div>
              <strong>Sources:</strong>
              <div style={{ marginTop: '4px' }}>
                {data.sources.map((source, index) => (
                  <span 
                    key={index}
                    style={{
                      display: 'inline-block',
                      background: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginRight: '8px',
                      marginBottom: '4px'
                    }}
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentCard;
