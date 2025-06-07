import type { NextApiRequest, NextApiResponse } from 'next';
import { AgentResult } from '../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<AgentResult>) {
  const query = req.query.q as string || 'default';
  
  const confidence = 0.8 + Math.random() * 0.15; // Between 0.8 and 0.95
  
  const summaries = [
    `Key findings on "${query}": (1) Molecular pathways show significant therapeutic potential, (2) Clinical trials demonstrate 67% efficacy rate, (3) Side effects are minimal and manageable, (4) Cost-effectiveness analysis favors implementation.`,
    `Research summary for "${query}": Current evidence supports a multi-target approach with biomarker-guided therapy. Success rates vary by patient population (45-78%). Regulatory approval likely within 2-3 years.`,
    `Literature synthesis on "${query}": Three major therapeutic mechanisms identified. Phase II trials show promise with 72% response rate. Key challenges include drug delivery and resistance mechanisms.`,
    `Comprehensive review of "${query}": Strong preclinical evidence, emerging clinical data, and favorable safety profile. Recommended next steps include expanded trials and biomarker validation.`
  ];

  const warnings = [];
  if (Math.random() > 0.6) {
    warnings.push('Summary based on available literature - may not include latest unpublished results');
  }

  const result: AgentResult = {
    result: summaries[Math.floor(Math.random() * summaries.length)],
    input_used: query,
    confidence: Math.round(confidence * 100) / 100,
    warnings,
    sources: [
      'Cochrane Reviews',
      'Nature Reviews',
      'Cell Reports',
      'The Lancet',
      'NEJM'
    ]
  };

  res.status(200).json(result);
}
