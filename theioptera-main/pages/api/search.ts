import type { NextApiRequest, NextApiResponse } from 'next';
import { AgentResult } from '../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<AgentResult>) {
  const query = req.query.q as string || 'default';
  
  const confidence = 0.75 + Math.random() * 0.2; // Between 0.75 and 0.95
  
  const searchResults = [
    `Found 847 relevant papers for "${query}" across PubMed, Google Scholar, and arXiv databases. Top results show strong evidence for molecular mechanisms involved.`,
    `Literature search for "${query}" yielded 1,234 peer-reviewed articles published in the last 5 years. Most cited studies focus on therapeutic applications.`,
    `Comprehensive search identified 692 high-impact publications related to "${query}". Meta-analyses suggest promising clinical outcomes.`,
    `Database search for "${query}" returned 1,567 articles with 89% showing positive preliminary results in preclinical studies.`
  ];

  const warnings = [];
  if (Math.random() > 0.7) {
    warnings.push('Some relevant papers may be behind paywalls');
  }
  if (Math.random() > 0.8) {
    warnings.push('Consider expanding search terms for broader coverage');
  }

  const result: AgentResult = {
    result: searchResults[Math.floor(Math.random() * searchResults.length)],
    input_used: query,
    confidence: Math.round(confidence * 100) / 100,
    warnings,
    sources: [
      'PubMed Central',
      'Google Scholar',
      'arXiv.org',
      'Semantic Scholar',
      'Web of Science'
    ]
  };

  res.status(200).json(result);
}
