import { Athlete, AssessmentTest, AssessmentResult, OfficialStats } from '../types';
import { mockAthletes, mockTests, mockResults, mockOfficialStats } from '../data/mockData';

// Centralized API Service for SportTalent AI
// Currently using Mock Data. Will be replaced by real backend later.
// Expected Env Var: import.meta.env.VITE_API_BASE_URL

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- Auth ---
  async login(email: string, password: string):Promise<{token: string, user: any}> {
    await delay(800);
    return { token: 'mock-jwt-token', user: { id: 'a1', role: 'athlete', email } };
  },
  
  // --- Athlete ---
  async getAthleteProfile(id: string): Promise<Athlete> {
    await delay(500);
    const athlete = mockAthletes.find(a => a.id === id);
    if (!athlete) throw new Error('Athlete not found');
    return athlete;
  },

  // --- Assessments ---
  async getAssessments(): Promise<AssessmentTest[]> {
    await delay(300);
    return mockTests;
  },

  async getAssessmentResult(resultId: string): Promise<AssessmentResult> {
    await delay(400);
    const result = mockResults.find(r => r.id === resultId);
    if (!result) throw new Error('Result not found');
    return result;
  },
  
  async getAthleteResults(athleteId: string): Promise<AssessmentResult[]> {
    await delay(400);
    return mockResults.filter(r => r.athleteId === athleteId);
  },

  // --- AI / Video ---
  async uploadVideo(file: File, testId: string): Promise<{ processId: string }> {
    await delay(1500); // simulate upload
    return { processId: 'proc_' + Math.random().toString(36).substring(7) };
  },
  
  async checkAiProcessStatus(processId: string): Promise<{ status: string, resultId?: string }> {
    await delay(800);
    // Simulate completing process
    return { status: 'completed', resultId: 'r1' };
  },

  // --- Official ---
  async getOfficialStats(): Promise<OfficialStats> {
    await delay(300);
    return mockOfficialStats;
  },
  
  async searchAthletes(query: string, filters: any): Promise<Athlete[]> {
    await delay(600);
    return mockAthletes; // simplified for now
  }
};
