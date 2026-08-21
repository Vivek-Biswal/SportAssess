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
  getProcessingStatus(jobId: string): Promise<CVProcessingResponse | { processing_status: 'processing' | 'failed' }>;
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
      console.log(`[CVService] Requesting analysis start for assessment: ${data.assessmentId}`);
      
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`CV Service Error: ${response.status} ${errorText}`);
      }
      
      const responseData = await response.json();
      return responseData as { jobId: string };
    } catch (error) {
      console.error('[CVService] Real CV service unreachable or failed:', (error as Error).message);
      throw error;
    }
  }

  async getProcessingStatus(jobId: string): Promise<CVProcessingResponse | { processing_status: 'processing' | 'failed' }> {
    try {
      console.log(`[CVService] Checking status for job: ${jobId}`);
      
      const response = await fetch(`${this.baseUrl}/api/status/${jobId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        if (response.status === 404) {
           return { processing_status: 'failed' };
        }
        const errorText = await response.text();
        throw new Error(`CV Service Error: ${response.status} ${errorText}`);
      }
      
      const responseData = await response.json();
      return responseData as CVProcessingResponse | { processing_status: 'processing' | 'failed' };
    } catch (error) {
      console.error('[CVService] Failed to get status:', error);
      throw error;
    }
  }
}

export const CVService = new TeammateCVService();
