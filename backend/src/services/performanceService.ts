import { Performance, IPerformance } from '../models/Performance';
import { createError } from '../middleware/errorHandler';

export async function getOrCreatePerformance(userId: string, projectId: string): Promise<IPerformance> {
  let perf = await Performance.findOne({ userId, projectId });
  if (!perf) {
    perf = await Performance.create({ userId, projectId });
  }
  return perf;
}

export async function addPoints(
  userId: string,
  projectId: string,
  points: number,
  action: string
): Promise<IPerformance> {
  const perf = await getOrCreatePerformance(userId, projectId);
  perf.totalPoints += points;
  perf.history.push({ date: new Date(), points, action });
  perf.lastUpdated = new Date();
  await perf.save();
  await updateRankings(projectId);
  return perf;
}

export async function updateMetrics(
  userId: string,
  projectId: string,
  metrics: Partial<IPerformance['metrics']>
): Promise<IPerformance> {
  const perf = await getOrCreatePerformance(userId, projectId);
  Object.assign(perf.metrics, metrics);
  perf.lastUpdated = new Date();
  await perf.save();
  return perf;
}

export async function recordTaskCompletion(userId: string, projectId: string, points: number): Promise<IPerformance> {
  const perf = await getOrCreatePerformance(userId, projectId);
  perf.tasksCompleted += 1;
  perf.totalPoints += points;
  perf.history.push({ date: new Date(), points, action: 'task_completed' });
  perf.lastUpdated = new Date();
  await perf.save();
  return perf;
}

export async function recordDocumentSubmission(userId: string, projectId: string, aiScore: number): Promise<IPerformance> {
  const perf = await getOrCreatePerformance(userId, projectId);
  perf.documentsSubmitted += 1;
  const total = perf.averageScore * (perf.documentsSubmitted - 1) + aiScore;
  perf.averageScore = total / perf.documentsSubmitted;
  perf.history.push({ date: new Date(), points: Math.round(aiScore / 10), action: 'document_submitted' });
  perf.lastUpdated = new Date();
  await perf.save();
  return perf;
}

export async function getLeaderboard(projectId: string) {
  return Performance.find({ projectId })
    .populate('userId', 'name email avatar')
    .sort({ totalPoints: -1, rank: 1 })
    .limit(20);
}

export async function getUserPerformance(userId: string, projectId: string): Promise<IPerformance> {
  const perf = await Performance.findOne({ userId, projectId }).populate('userId', 'name email avatar');
  if (!perf) throw createError('Performance record not found', 404);
  return perf;
}

async function updateRankings(projectId: string): Promise<void> {
  const performances = await Performance.find({ projectId }).sort({ totalPoints: -1 });
  const updates = performances.map((p, idx) =>
    Performance.findByIdAndUpdate(p._id, { rank: idx + 1 })
  );
  await Promise.all(updates);
}

export async function getPerformanceAnalytics(projectId: string) {
  const performances = await Performance.find({ projectId }).populate('userId', 'name email avatar');

  const totalPoints = performances.reduce((sum, p) => sum + p.totalPoints, 0);
  const avgPoints = performances.length > 0 ? totalPoints / performances.length : 0;
  const avgScore = performances.reduce((sum, p) => sum + p.averageScore, 0) / (performances.length || 1);

  return {
    projectId,
    teamSize: performances.length,
    totalPointsAwarded: totalPoints,
    averagePoints: Math.round(avgPoints),
    averageDocumentScore: Math.round(avgScore * 10) / 10,
    topPerformer: performances[0] || null,
    members: performances,
  };
}
