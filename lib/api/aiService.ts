import { ReasoningRequest, ReasoningResponse, ApiResponse } from '@/types/ai';

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async getReasoningAnalysis(request: ReasoningRequest): Promise<ApiResponse<ReasoningResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/reasoning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: 'Failed to get reasoning analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async batchReasoningAnalysis(requests: ReasoningRequest[]): Promise<ApiResponse<ReasoningResponse[]>> {
    try {
      const promises = requests.map(request => this.getReasoningAnalysis(request));
      const results = await Promise.allSettled(promises);
      
      const successfulResults: ReasoningResponse[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successfulResults.push(result.value.data!);
        } else {
          errors.push(`Request ${index + 1}: ${result.status === 'fulfilled' ? result.value.error : result.reason}`);
        }
      });

      return {
        success: errors.length === 0,
        data: successfulResults,
        error: errors.length > 0 ? errors.join('; ') : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Batch processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/reasoning`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIService();

export type { ReasoningRequest, ReasoningResponse };
