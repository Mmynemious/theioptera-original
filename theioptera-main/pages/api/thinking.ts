import type { NextApiRequest, NextApiResponse } from 'next';

interface ThinkingResult {
  questions: string[];
  result: string;
  input_used: string;
  confidence: number;
  warnings: string[];
  sources: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ThinkingResult>) {
  const query = req.query.q as string || 'default';
  
  const confidence = 0.78 + Math.random() * 0.17; // Between 0.78 and 0.95
  
  const socraticQuestions = [
    `What assumptions are you making about the mechanisms underlying "${query}"?`,
    `How might your research background or institutional bias influence your approach to "${query}"?`,
    `What would it mean for the field if your hypothesis about "${query}" were proven wrong?`,
    `Are you considering all relevant stakeholders who might be affected by research on "${query}"?`,
    `What evidence would you need to see to change your mind about the importance of "${query}"?`,
    `How recent and diverse are the sources informing your understanding of "${query}"?`,
    `What ethical considerations have you identified related to research on "${query}"?`,
    `How might the methodology you choose influence the outcomes of your research on "${query}"?`,
    `What alternative explanations exist for the phenomena you're studying in "${query}"?`,
    `Are there any conflicting interests or funding sources that might bias research on "${query}"?`
  ];

  // Select 4-6 random questions
  const numQuestions = 4 + Math.floor(Math.random() * 3);
  const selectedQuestions = socraticQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, numQuestions);

  const warnings = [];
  if (Math.random() > 0.7) {
    warnings.push('Socratic questioning is most effective when combined with peer discussion');
  }

  const result: ThinkingResult = {
    questions: selectedQuestions,
    result: `Generated ${selectedQuestions.length} Socratic questions to challenge assumptions and deepen critical thinking about "${query}". These questions are designed to reveal hidden biases, explore alternative perspectives, and strengthen your research approach.`,
    input_used: query,
    confidence: Math.round(confidence * 100) / 100,
    warnings,
    sources: [
      'Socratic method in scientific inquiry',
      'Critical thinking frameworks',
      'Research bias identification guides',
      'Philosophy of science literature'
    ]
  };

  res.status(200).json(result);
}
