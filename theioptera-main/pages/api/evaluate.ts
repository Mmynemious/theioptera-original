import type { NextApiRequest, NextApiResponse } from 'next';
import { AgentResult } from '../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<AgentResult>) {
  const query = req.query.q as string || 'default';
  
  const confidence = 0.74 + Math.random() * 0.21; // Between 0.74 and 0.95
  
  const evaluations = [
    `Hypothesis evaluation for "${query}": FEASIBILITY: High (established methodologies available). NOVELTY: Medium-High (builds on known mechanisms). IMPACT: High (addresses unmet clinical need). RISK: Medium (regulatory pathway clear). TIMELINE: 3-5 years to clinical proof-of-concept.`,
    `Critical assessment of "${query}": SCIENTIFIC MERIT: Strong (supported by robust preclinical data). TECHNICAL FEASIBILITY: Good (validated assays available). COMMERCIAL VIABILITY: Promising (large market size). COMPETITIVE LANDSCAPE: Moderate (2-3 major competitors). SUCCESS PROBABILITY: 65%.`,
    `Evaluation summary for "${query}": STRENGTH: Novel mechanism with strong biological rationale. WEAKNESS: Limited clinical validation. OPPORTUNITY: First-in-class potential. THREAT: Regulatory complexity. RECOMMENDATION: Proceed with Phase I studies and biomarker development.`,
    `Research assessment for "${query}": INNOVATION SCORE: 8.2/10. TECHNICAL RISK: Medium. RESOURCE REQUIREMENTS: $12-18M over 36 months. KEY MILESTONES: Proof-of-mechanism (Month 12), Toxicology completion (Month 24), IND filing (Month 30).`
  ];

  const warnings = [];
  if (Math.random() > 0.4) {
    warnings.push('Evaluation based on current data - may change with new findings');
  }
  if (confidence < 0.85) {
    warnings.push('Consider additional validation studies to strengthen evaluation');
  }

  const result: AgentResult = {
    result: evaluations[Math.floor(Math.random() * evaluations.length)],
    input_used: query,
    confidence: Math.round(confidence * 100) / 100,
    warnings,
    sources: [
      'Technology readiness level frameworks',
      'Pharmaceutical R&D guidelines',
      'Market analysis reports',
      'Regulatory precedents'
    ]
  };

  res.status(200).json(result);
}
