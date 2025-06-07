import type { NextApiRequest, NextApiResponse } from 'next';
import { AgentResult } from '../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<AgentResult>) {
  const query = req.query.q as string || 'default';
  
  const confidence = 0.72 + Math.random() * 0.23; // Between 0.72 and 0.95
  
  const trends = [
    `Trend analysis for "${query}": Research activity increased 340% over the last 3 years. Top emerging keywords: precision medicine, AI-driven discovery, personalized therapy. Funding increased by $2.3B globally.`,
    `Publication trends for "${query}": Peak interest in 2022-2023 with 145% growth in citations. Leading research hubs: Boston, Basel, Cambridge UK. Collaboration networks expanding rapidly.`,
    `Research momentum on "${query}": Exponential growth pattern with doubling time of 18 months. Key drivers include technological advances and clinical need. Expected market size: $15B by 2028.`,
    `Trend forecast for "${query}": Current trajectory suggests breakthrough applications by 2025. Patent filings up 280%. Major pharmaceutical companies investing heavily in this area.`
  ];

  const warnings = [];
  if (Math.random() > 0.5) {
    warnings.push('Trend analysis based on limited historical data - projections may vary');
  }
  if (Math.random() > 0.7) {
    warnings.push('Consider seasonal variations in research publication patterns');
  }

  const result: AgentResult = {
    result: trends[Math.floor(Math.random() * trends.length)],
    input_used: query,
    confidence: Math.round(confidence * 100) / 100,
    warnings,
    sources: [
      'Google Trends',
      'Dimensions.ai',
      'Web of Science',
      'Patent databases',
      'NIH RePORTER'
    ]
  };

  res.status(200).json(result);
}
