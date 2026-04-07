export interface SubtaskSuggestion {
  title: string;
  description: string;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high';
}

export interface DocumentAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface PerformanceInsight {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  predictedFinalScore: number;
}

export interface ProjectReport {
  executiveSummary: string;
  keyAchievements: string[];
  challenges: string[];
  teamPerformanceSummary: string;
  recommendations: string[];
  riskAssessment: string;
}

const subtaskTemplates: Record<string, SubtaskSuggestion[]> = {
  default: [
    { title: 'Research and gather requirements', description: 'Identify all requirements and constraints for this task', estimatedHours: 2, priority: 'high' },
    { title: 'Design architecture/approach', description: 'Plan the technical approach and design the solution', estimatedHours: 3, priority: 'high' },
    { title: 'Implement core functionality', description: 'Build the main features and core logic', estimatedHours: 8, priority: 'high' },
    { title: 'Write unit tests', description: 'Create comprehensive test coverage for the implementation', estimatedHours: 2, priority: 'medium' },
    { title: 'Documentation', description: 'Write technical documentation and comments', estimatedHours: 1, priority: 'low' },
    { title: 'Code review and refinement', description: 'Review code quality and make improvements', estimatedHours: 1, priority: 'medium' },
  ],
  frontend: [
    { title: 'Create wireframes/mockups', description: 'Design the UI layout and user flow', estimatedHours: 2, priority: 'high' },
    { title: 'Implement responsive layout', description: 'Build the responsive HTML/CSS structure', estimatedHours: 4, priority: 'high' },
    { title: 'Add interactivity and state management', description: 'Implement user interactions and data flow', estimatedHours: 6, priority: 'high' },
    { title: 'Cross-browser testing', description: 'Test on multiple browsers and devices', estimatedHours: 2, priority: 'medium' },
    { title: 'Performance optimization', description: 'Optimize load times and rendering performance', estimatedHours: 2, priority: 'medium' },
  ],
  backend: [
    { title: 'Design database schema', description: 'Plan data models and relationships', estimatedHours: 2, priority: 'high' },
    { title: 'Implement API endpoints', description: 'Create RESTful API routes and controllers', estimatedHours: 6, priority: 'high' },
    { title: 'Add authentication and authorization', description: 'Implement security middleware', estimatedHours: 3, priority: 'high' },
    { title: 'Set up database migrations', description: 'Create database migration scripts', estimatedHours: 1, priority: 'medium' },
    { title: 'API documentation', description: 'Document all API endpoints with examples', estimatedHours: 2, priority: 'medium' },
  ],
};

export async function suggestSubtasks(
  taskTitle: string,
  _taskDescription: string,
  _projectContext?: string
): Promise<SubtaskSuggestion[]> {
  await simulateDelay(500);

  const titleLower = taskTitle.toLowerCase();
  let template = subtaskTemplates.default;

  if (titleLower.includes('frontend') || titleLower.includes('ui') || titleLower.includes('interface')) {
    template = subtaskTemplates.frontend;
  } else if (titleLower.includes('backend') || titleLower.includes('api') || titleLower.includes('server')) {
    template = subtaskTemplates.backend;
  }

  return template.map((t) => ({
    ...t,
    title: `${t.title} for: ${taskTitle.substring(0, 30)}`,
  }));
}

export async function analyzeDocument(
  _fileName: string,
  _fileType: string,
  _context?: { taskTitle?: string; projectTitle?: string }
): Promise<DocumentAnalysis> {
  await simulateDelay(800);

  const score = Math.floor(Math.random() * 40) + 55;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

  const feedbackMap: Record<string, string[]> = {
    A: [
      'Excellent work! The document demonstrates a thorough understanding of the subject.',
      'Outstanding quality with well-structured content and clear explanations.',
    ],
    B: [
      'Good work with solid content. A few areas could benefit from more detail.',
      'Well-organized document with clear objectives. Consider adding more examples.',
    ],
    C: [
      'Satisfactory submission. The core concepts are present but need more depth.',
      'Adequate coverage of the topic. Improvements needed in technical accuracy.',
    ],
    D: [
      'Below expectations. Significant revisions needed to meet requirements.',
      'The document lacks sufficient detail and technical accuracy.',
    ],
    F: [
      'Does not meet minimum requirements. Major revision required.',
      'Insufficient coverage of required topics. Please review the guidelines.',
    ],
  };

  const feedbackOptions = feedbackMap[grade];
  const feedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];

  return {
    score,
    grade,
    feedback,
    strengths: [
      'Clear document structure and organization',
      'Good use of technical terminology',
      'Adequate coverage of main requirements',
    ].slice(0, Math.floor(Math.random() * 2) + 1),
    weaknesses: [
      'Could benefit from more detailed examples',
      'Some technical explanations need clarification',
      'References and citations could be improved',
    ].slice(0, Math.floor(Math.random() * 2) + 1),
    suggestions: [
      'Add more detailed technical specifications',
      'Include diagrams or visual representations where appropriate',
      'Expand the conclusion section with actionable outcomes',
      'Review and update references to ensure currency',
      'Consider adding a glossary for technical terms',
    ].slice(0, Math.floor(Math.random() * 3) + 2),
  };
}

export async function analyzePerformance(
  performanceData: {
    totalPoints: number;
    tasksCompleted: number;
    documentsSubmitted: number;
    averageScore: number;
    metrics: Record<string, number>;
  }
): Promise<PerformanceInsight> {
  await simulateDelay(600);

  const overallScore = (
    (performanceData.metrics['onTimeDelivery'] ?? 0) * 0.3 +
    (performanceData.metrics['qualityScore'] ?? 0) * 0.4 +
    (performanceData.metrics['collaborationScore'] ?? 0) * 0.2 +
    (performanceData.metrics['aiScore'] ?? 0) * 0.1
  );

  return {
    summary: `Based on ${performanceData.tasksCompleted} completed tasks and ${performanceData.documentsSubmitted} documents, your overall performance score is ${Math.round(overallScore)}/100.`,
    strengths: [
      (performanceData.metrics['onTimeDelivery'] ?? 0) > 70 ? 'Consistent on-time delivery' : null,
      (performanceData.metrics['qualityScore'] ?? 0) > 70 ? 'High quality submissions' : null,
      (performanceData.metrics['collaborationScore'] ?? 0) > 70 ? 'Strong team collaboration' : null,
    ].filter(Boolean) as string[],
    areasForImprovement: [
      (performanceData.metrics['onTimeDelivery'] ?? 0) <= 70 ? 'Time management and deadline adherence' : null,
      (performanceData.metrics['qualityScore'] ?? 0) <= 70 ? 'Document quality and technical accuracy' : null,
      performanceData.tasksCompleted < 5 ? 'Task completion rate' : null,
    ].filter(Boolean) as string[],
    recommendations: [
      'Break down complex tasks into smaller, manageable subtasks',
      'Schedule regular check-ins with your guide for feedback',
      'Review high-scoring submissions for best practices',
      'Utilize the AI document analysis tool before final submission',
    ],
    predictedFinalScore: Math.min(100, Math.round(overallScore * 1.1)),
  };
}

export async function generateProjectReport(
  projectData: {
    title: string;
    status: string;
    teamSize: number;
    tasksCompleted: number;
    totalTasks: number;
    avgScore: number;
  }
): Promise<ProjectReport> {
  await simulateDelay(1000);

  const completionRate = projectData.totalTasks > 0
    ? Math.round((projectData.tasksCompleted / projectData.totalTasks) * 100)
    : 0;

  return {
    executiveSummary: `The project "${projectData.title}" is currently ${projectData.status} with a ${completionRate}% task completion rate. A team of ${projectData.teamSize} members has maintained an average document score of ${projectData.avgScore.toFixed(1)}/100.`,
    keyAchievements: [
      `Completed ${projectData.tasksCompleted} out of ${projectData.totalTasks} tasks`,
      `Maintained an average quality score of ${projectData.avgScore.toFixed(1)}/100`,
      `Team of ${projectData.teamSize} members working collaboratively`,
    ],
    challenges: [
      'Managing complex task dependencies across team members',
      'Ensuring consistent documentation quality across all submissions',
      'Balancing technical depth with project timeline constraints',
    ],
    teamPerformanceSummary: `The team demonstrates ${completionRate > 70 ? 'strong' : 'developing'} performance with ${completionRate}% task completion. Document quality averages ${projectData.avgScore.toFixed(1)}/100, indicating ${projectData.avgScore > 70 ? 'satisfactory' : 'room for improvement in'} technical output.`,
    recommendations: [
      'Implement weekly team sync meetings to address blockers',
      'Create a shared knowledge base for common technical solutions',
      'Schedule peer review sessions to improve document quality',
      'Set up automated reminders for upcoming deadlines',
    ],
    riskAssessment: completionRate < 50
      ? 'HIGH: Project is significantly behind schedule. Immediate intervention required.'
      : completionRate < 75
      ? 'MEDIUM: Project is progressing but may need additional support to meet deadlines.'
      : 'LOW: Project is on track. Continue current approach with regular monitoring.',
  };
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
