export interface CVProcessingRequest {
  assessmentId: string;
  athleteId: string;
  testType: string;
  videoUrl: string;
}

export interface CVProcessingResponse {
  test: string;
  score: number;
  unit: string;
  confidence: number;
  verification_status: 'verified' | 'failed' | 'manual_review';
  cheat_detected: boolean;
  cheat_score: number;
  duration: number | null;
  reps: number | null;
  benchmark: string | null;
  percentile: number | null;
  processing_status: 'success' | 'failed' | 'processing';
}

export interface ICVService {
  analyzeVideo(data: CVProcessingRequest): Promise<{ jobId: string }>;
  getProcessingStatus(jobId: string): Promise<CVProcessingResponse | { processing_status: 'processing' }>;
}

class TeammateCVService implements ICVService {
  private get baseUrl() {
    return process.env.CV_SERVICE_URL || 'http://localhost:8000';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CV_SERVICE_API_KEY || ''}`
    };
  }

  async analyzeVideo(data: CVProcessingRequest): Promise<{ jobId: string }> {
    try {
      // In production, this would be a real fetch call:
      /*
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('CV Service Error');
      return await response.json();
      */

      console.log(`[CVService] Simulating analysis start for assessment: ${data.assessmentId}`);
      
      // Mock implementation returning a fake job ID
      return { jobId: `cv_job_${Date.now()}` };
    } catch (error) {
      console.error('[CVService] Failed to start analysis:', error);
      throw error;
    }
  }

  async getProcessingStatus(jobId: string): Promise<CVProcessingResponse | { processing_status: 'processing' }> {
    try {
       // In production, this would be a real fetch call:
      /*
      const response = await fetch(`${this.baseUrl}/api/status/${jobId}`, {
        headers: this.headers
      });
      
      if (!response.ok) throw new Error('CV Service Error');
      return await response.json();
      */
      
      console.log(`[CVService] Simulating status check for job: ${jobId}`);
      
      // Mock returning a completed status after a short delay
      return {
        test: 'vertical_jump',
        score: 48.5,
        unit: 'cm',
        confidence: 0.94,
        verification_status: 'verified',
        cheat_detected: false,
        cheat_score: 0.03,
        duration: null,
        reps: null,
        benchmark: null,
        percentile: null,
        processing_status: 'success'
      };
    } catch (error) {
      console.error('[CVService] Failed to get status:', error);
      throw error;
    }
  }
}

export const CVService = new TeammateCVService();
