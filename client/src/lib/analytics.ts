import { AnalyticsData } from "@shared/schema";

let currentAnalytics: AnalyticsData | null = null;

export function setAnalytics(data: AnalyticsData) {
  currentAnalytics = data;
  localStorage.setItem('analytics', JSON.stringify(data));
}

export function getAnalytics(): AnalyticsData | null {
  if (currentAnalytics) {
    return currentAnalytics;
  }
  
  const stored = localStorage.getItem('analytics');
  if (stored) {
    try {
      currentAnalytics = JSON.parse(stored);
      return currentAnalytics;
    } catch {
      return null;
    }
  }
  
  return null;
}

export function clearAnalytics() {
  currentAnalytics = null;
  localStorage.removeItem('analytics');
}
