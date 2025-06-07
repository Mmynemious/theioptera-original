import { useState, useEffect } from 'react';
import { EvidenceResult, Paper } from '../types';
import { storage } from '../utils/storage';

const EvidencePage = () => {
  const [evidence, setEvidence] = useState<EvidenceResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const question = storage.getCurrentQuestion();
    setCurrentQuestion(question);
  }, []);

  const analyzeEvidence = async () => {
    setLoading(true);
    try {
      const question = storage.getCurrentQuestion() || 'default';
      const res = await fetch(`/api/evidence?q=${encodeURIComponent(question)}`);
      const data: EvidenceResult = await res.json();
      setEvidence(data);
    } catch (error) {
      console.error('Error analyzing evidence:', error);
      alert('Failed to analyze evidence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0.8) return 'hsl(var(--success))';
    if (score > 0.6) return 'hsl(var(--warning))';
    return 'hsl(var(--error))';
  };

  const PaperTable = ({ papers, title, emptyMessage }: { 
    papers: Paper[], 
    title: string, 
    emptyMessage: string 
  }) => (
    <div>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        marginBottom: '16px',
        color: papers.length > 0 ? 'hsl(var(--text))' : 'hsl(var(--text-muted))'
      }}>
        {title} ({papers.length})
      </h3>
      
      {papers.length > 0 ? (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Paper Title</th>
                <th>Stance</th>
                <th>Score</th>
                <th>Authors</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '500' }}>{paper.title}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: paper.stance === 'support' ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--error) / 0.1)',
                      color: paper.stance === 'support' ? 'hsl(var(--success))' : 'hsl(var(--error))'
                    }}>
                      {paper.stance.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ 
                    fontWeight: '600',
                    color: getScoreColor(paper.score)
                  }}>
                    {(paper.score * 100).toFixed(1)}%
                  </td>
                  <td className="text-muted text-sm">{paper.authors || 'N/A'}</td>
                  <td className="text-muted text-sm">{paper.year || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
        📊 Evidence Analysis
      </h1>
      
      <p style={{ fontSize: '18px', color: 'hsl(var(--text-muted))', marginBottom: '32px' }}>
        Examine supporting and opposing evidence for your research hypothesis.
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

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <button 
          onClick={analyzeEvidence} 
          disabled={loading || !currentQuestion}
          className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
          style={{ fontSize: '18px', padding: '16px 32px' }}
        >
          {loading ? (
            <>
              <span className="spinner mr-2"></span>
              Analyzing Evidence...
            </>
          ) : (
            '🔍 Analyze Evidence'
          )}
        </button>
      </div>

      {evidence && (
        <>
          {/* Summary Statistics */}
          <div className="card" style={{ marginBottom: '40px', background: 'hsl(var(--background))' }}>
            <h3 style={{ marginBottom: '16px' }}>Evidence Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'hsl(var(--success))' }}>
                  {evidence.supporting.length}
                </div>
                <div className="text-muted">Supporting Papers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'hsl(var(--error))' }}>
                  {evidence.opposing.length}
                </div>
                <div className="text-muted">Opposing Papers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'hsl(var(--primary))' }}>
                  {evidence.supporting.length + evidence.opposing.length}
                </div>
                <div className="text-muted">Total Papers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: evidence.supporting.length > evidence.opposing.length ? 'hsl(var(--success))' : 
                         evidence.opposing.length > evidence.supporting.length ? 'hsl(var(--error))' : 'hsl(var(--warning))'
                }}>
                  {evidence.supporting.length > evidence.opposing.length ? '✅' : 
                   evidence.opposing.length > evidence.supporting.length ? '⚠️' : '⚖️'}
                </div>
                <div className="text-muted">Evidence Balance</div>
              </div>
            </div>
          </div>

          {/* Evidence Tables */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <PaperTable 
              papers={evidence.supporting}
              title="Supporting Evidence"
              emptyMessage="No supporting papers found."
            />
            
            <PaperTable 
              papers={evidence.opposing}
              title="Opposing Evidence"
              emptyMessage="No opposing papers found."
            />
          </div>

          {/* Analysis Insights */}
          <div className="card" style={{ marginTop: '40px' }}>
            <h3 style={{ marginBottom: '16px' }}>💡 Analysis Insights</h3>
            <div style={{ lineHeight: '1.6' }}>
              {evidence.supporting.length > evidence.opposing.length ? (
                <p style={{ color: 'hsl(var(--success))' }}>
                  <strong>Strong Support:</strong> The evidence heavily favors your hypothesis with {evidence.supporting.length} supporting papers vs {evidence.opposing.length} opposing.
                </p>
              ) : evidence.opposing.length > evidence.supporting.length ? (
                <p style={{ color: 'hsl(var(--error))' }}>
                  <strong>Strong Opposition:</strong> The evidence suggests challenges to your hypothesis with {evidence.opposing.length} opposing papers vs {evidence.supporting.length} supporting.
                </p>
              ) : (
                <p style={{ color: 'hsl(var(--warning))' }}>
                  <strong>Balanced Evidence:</strong> The research shows equal support and opposition. Consider refining your hypothesis or exploring specific conditions.
                </p>
              )}
              
              {evidence.supporting.length + evidence.opposing.length === 0 && (
                <p style={{ color: 'hsl(var(--text-muted))' }}>
                  No evidence papers found. This could indicate a novel research area or the need to broaden search terms.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Research Guidelines */}
      <div className="card" style={{ marginTop: '40px', background: 'hsl(var(--background))' }}>
        <h3 style={{ marginBottom: '16px' }}>📚 Evidence Evaluation Guidelines</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Quality over Quantity:</strong> Consider the methodology and rigor of studies</li>
          <li><strong>Publication Bias:</strong> Look for unpublished studies and negative results</li>
          <li><strong>Temporal Relevance:</strong> Newer studies may reflect current understanding better</li>
          <li><strong>Sample Size:</strong> Larger studies generally provide more reliable evidence</li>
          <li><strong>Peer Review:</strong> Prioritize peer-reviewed publications</li>
          <li><strong>Replication:</strong> Multiple studies showing similar results increase confidence</li>
        </ul>
      </div>
    </div>
  );
};

export default EvidencePage;
