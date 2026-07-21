/**
 * Elo Rating Utilities for Mockrithm
 * Pure numeric Elo rating system for candidate mock interview evaluations.
 */

export interface EloCalculationResult {
  previousElo: number;
  newElo: number;
  deltaElo: number;
}

/**
 * Normalizes role string for consistent key lookup in eloByRole dictionary.
 */
export function normalizeRoleName(role?: string): string {
  if (!role || typeof role !== "string") return "Software Engineer";
  const trimmed = role.trim();
  if (!trimmed) return "Software Engineer";
  
  // Capitalize each word properly
  return trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Calculates Elo rating change based on interview score (0-100).
 * @param currentElo Candidate's current numeric ELO rating (default 1200)
 * @param score Performance score from 0 to 100
 * @param benchmarkElo Opponent difficulty benchmark rating (default 1500)
 * @param kFactor K-factor scaling weight (default 32)
 */
export function calculateEloChange(
  currentElo: number = 1200,
  score: number = 70,
  benchmarkElo: number = 1500,
  kFactor: number = 32
): EloCalculationResult {
  const safeCurrentElo = Math.max(100, Math.round(currentElo || 1200));
  const safeScore = Math.max(0, Math.min(100, score));
  
  // Actual score S in [0, 1]
  const actualScore = safeScore / 100;
  
  // Expected score E based on ELO formula vs benchmark
  const expectedScore = 1 / (1 + Math.pow(10, (benchmarkElo - safeCurrentElo) / 400));
  
  // Rating delta calculation
  const rawDelta = kFactor * (actualScore - expectedScore);
  const deltaElo = Math.round(rawDelta);
  
  // Floor rating at 100 ELO minimum
  const newElo = Math.max(100, safeCurrentElo + deltaElo);

  return {
    previousElo: safeCurrentElo,
    newElo,
    deltaElo,
  };
}
