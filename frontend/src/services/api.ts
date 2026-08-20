import { Athlete, AssessmentTest, AssessmentResult, OfficialStats } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper for authorized fetches
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // If body is FormData, don't set Content-Type so browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || data?.message || 'API request failed';
    throw new Error(errorMessage);
  }

  return data.data;
};

export const api = {
  // --- Auth ---
  async register(data: {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    state: string;
    district: string;
    role?: 'athlete' | 'official';
  }): Promise<{token: string, user: any}> {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async login(email: string, password: string): Promise<{token: string, user: any}> {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  async getMe(): Promise<{user: any}> {
    return fetchApi('/auth/me');
  },
  
  // --- Athlete ---
  async getAthleteProfile(id: string): Promise<Athlete> {
    return fetchApi(`/athletes/${id}`);
  },

  // --- Assessments ---
  async getAssessments(): Promise<AssessmentTest[]> {
    return fetchApi('/assessments');
  },

  async getAssessmentResult(resultId: string): Promise<AssessmentResult> {
    return fetchApi(`/results/${resultId}`);
  },
  
  async getAthleteResults(athleteId: string): Promise<AssessmentResult[]> {
    return fetchApi(`/results/athlete/${athleteId}`);
  },

  // --- AI / Video ---
  async uploadVideo(file: File, testId: string): Promise<{ processId: string }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('testId', testId);

    return fetchApi('/videos/upload', {
      method: 'POST',
      body: formData,
    });
  },
  
  async checkAiProcessStatus(processId: string): Promise<{ status: string, resultId?: string }> {
    return fetchApi(`/ai/process/${processId}`);
  },

  // --- Official ---
  async getOfficialStats(): Promise<OfficialStats> {
    return fetchApi('/official/stats');
  },
  
  async searchAthletes(query: string, filters: any): Promise<Athlete[]> {
    // Basic query builder mapping to our backend controller
    const params = new URLSearchParams();
    if (filters?.gender && filters.gender !== 'All') params.append('gender', filters.gender);
    if (filters?.sport) params.append('sport', filters.sport);
    if (query) params.append('name', query); // Depending on how you want to search

    return fetchApi(`/athletes/search?${params.toString()}`);
  },

  // --- Benchmarks ---
  async getBenchmarks(filters?: { test?: string; gender?: string; ageGroup?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.test) params.append('test', filters.test);
    if (filters?.gender && filters.gender !== 'All') params.append('gender', filters.gender);
    if (filters?.ageGroup) params.append('ageGroup', filters.ageGroup);

    return fetchApi(`/benchmarks?${params.toString()}`);
  }
};
