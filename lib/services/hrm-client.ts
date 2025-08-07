// lib/services/hrm-client.ts

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * HRM Client for communicating with Hierarchical Reasoning Model service
 * Handles all interactions with the Python FastAPI HRM service
 */

// Configuration interface for better type safety
interface HRMConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

// Metadata interface for request tracking
interface RequestMetadata {
  requestId: string;
  startTime: number;
}

// Service statistics interfaces
interface ModelInfo {
  name: string;
  version: string;
  parameters: number;
  memory_usage: number;
  gpu_memory_used?: number;
  model_size_mb: number;
}

interface PerformanceMetrics {
  avg_response_time: number;
  requests_per_second: number;
  error_rate: number;
  uptime_percentage: number;
  total_requests: number;
  failed_requests: number;
  cache_hit_rate?: number;
}

interface QueueStatus {
  pending_requests: number;
  active_workers: number;
  max_queue_size: number;
  current_load: number;
  average_wait_time: number;
  queue_full_events: number;
}

interface ServiceStats {
  model_info: ModelInfo;
  performance_metrics: PerformanceMetrics;
  queue_status: QueueStatus;
}

// Type for flexible object properties
type FlexibleValue = string | number | boolean | string[] | object | undefined;

export interface ReasoningRequest {
  user_id: string;
  problem_type: 'flashcard' | 'quiz' | 'assessment' | 'adaptive_path';
  input_data: {
    flashcard_id?: string;
    question_complexity?: number;
    response_time?: number;
    quality_score?: number;
    confidence_level?: number;
    reasoning_steps?: string[];
    conceptual_understanding?: number;
    problem_solving_approach?: 'analytical' | 'intuitive' | 'mixed';
    hints_used?: number;
    partial_correct?: boolean;
    metacognitive_awareness?: number;
    question_text?: string;
    answer_text?: string;
    user_response?: string;
    // Replace any with specific union type
    [key: string]: string | number | boolean | string[] | undefined;
  };
  context: {
    subject?: string;
    topic?: string;
    difficulty_level?: number;
    user_history?: {
      previous_performance?: number[];
      reasoning_depth_history?: number[];
      pattern_recognition_history?: number[];
      success_rate?: number;
      average_response_time?: number;
      difficulty_trend?: 'improving' | 'stable' | 'declining';
    };
    session_context?: {
      session_id?: string;
      cards_reviewed?: number;
      session_start_time?: string;
      fatigue_level?: number;
    };
    // Replace any with specific union type
    [key: string]: FlexibleValue;
  };
  session_id?: string;
}

export interface ReasoningResponse {
  reasoning_depth: number;
  pattern_recognition: number;
  cognitive_load: number;
  recommended_difficulty: number;
  learning_insights: {
    reasoning_strengths: string[];
    improvement_areas: string[];
    study_recommendations: string[];
    optimal_study_time: number;
  };
  adaptive_factors: {
    difficulty_multiplier: number;
    interval_adjustment: number;
    confidence_factor: number;
    retention_prediction: number;
  };
  processing_time_ms: number;
}

export interface AdaptiveScheduleRequest {
  user_id: string;
  flashcard_history: Array<{
    flashcard_id: string;
    quality_responses: number[];
    reasoning_depth_history: number[];
    pattern_recognition_history: number[];
    cognitive_load_history: number[];
    last_reviewed: string;
    success_rate: number;
  }>;
  current_performance: {
    session_quality: number;
    reasoning_trend: string;
    cognitive_state: string;
  };
  learning_goals: {
    target_mastery_level: number;
    time_constraints: number; // minutes per day
    priority_subjects: string[];
  };
}

export interface AdaptiveScheduleResponse {
  next_review_intervals: Array<{
    flashcard_id: string;
    recommended_interval_days: number;
    priority_score: number;
    reasoning_based_adjustment: number;
  }>;
  difficulty_adjustments: Array<{
    flashcard_id: string;
    current_difficulty: number;
    recommended_difficulty: number;
    adjustment_reason: string;
  }>;
  learning_trajectory: {
    predicted_mastery_timeline: string;
    focus_areas: string[];
    estimated_study_time: number;
    success_probability: number;
  };
}

export interface QuizGenerationRequest {
  user_id: string;
  topic: string;
  difficulty_level: number;
  question_count: number;
  question_types: ('mcq' | 'written' | 'analytical' | 'application')[];
  content_source: {
    text_content?: string;
    reference_materials?: string[];
    learning_objectives?: string[];
  };
  user_profile: {
    reasoning_level: number;
    strengths: string[];
    weaknesses: string[];
    preferred_question_style: string;
  };
}

export interface QuizGenerationResponse {
  questions: Array<{
    id: string;
    type: 'mcq' | 'written' | 'analytical' | 'application';
    question_text: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
    difficulty_level: number;
    cognitive_load: number;
    reasoning_steps_required: string[];
    time_estimate: number;
    learning_objective: string;
  }>;
  quiz_metadata: {
    total_estimated_time: number;
    difficulty_distribution: { [key: string]: number };
    cognitive_load_profile: string;
    adaptive_recommendations: string[];
  };
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  gpu_available: boolean;
  redis_connected: boolean;
  model_loaded: boolean;
  version: string;
  uptime_seconds: number;
  queue_size: number;
  avg_response_time_ms: number;
}

export class HRMClient {
  private client: AxiosInstance;
  private config: HRMConfig;
  private circuitBreakers: Map<string, {
    open: boolean;
    failures: number;
    lastFailure: Date;
  }> = new Map();
  private lastHealthCheck: Date | null;
  private healthCheckInterval: number;
  private healthCheckCache: {
    status: HealthCheckResponse | null;
    timestamp: number;
  } = { status: null, timestamp: 0 };
  private requestMetadata: Map<string, RequestMetadata> = new Map();

  constructor() {
    this.config = this.getConfig();
    this.lastHealthCheck = null;
    this.healthCheckInterval = 300000; // 5 minutes

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Kanchen-Academy-Frontend/1.0',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get configuration with type safety
   */
  private getConfig(): HRMConfig {
    return {
      baseUrl: process.env.HRM_SERVICE_URL || 'http://localhost:8000',
      timeout: parseInt(process.env.HRM_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.HRM_RETRY_ATTEMPTS || '3', 10)
    };
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor with enhanced logging
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestId = Math.random().toString(36).substring(7);
        const metadata: RequestMetadata = { 
          requestId, 
          startTime: Date.now() 
        };
        
        // Store metadata using a unique key
        this.requestMetadata.set(requestId, metadata);
        
        // Add request ID to headers for tracking - FIXED
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = requestId;
        
        // Set endpoint-specific timeout
        if (config.url) {
          config.timeout = this.getTimeoutForEndpoint(config.url);
        }

        console.log(`[HRM Client] [${requestId}] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[HRM Client] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor with timing
    this.client.interceptors.response.use(
      (response) => {
        const requestId = response.config.headers?.['X-Request-ID'] as string;
        const metadata = requestId ? this.requestMetadata.get(requestId) : null;
        const duration = metadata ? Date.now() - metadata.startTime : 0;
        const processingTime = response.data?.processing_time_ms || 0;
        
        console.log(`[HRM Client] [${requestId || 'unknown'}] Response: ${response.status} (${duration}ms total, ${processingTime}ms processing)`);
        
        // Clean up metadata
        if (requestId) {
          this.requestMetadata.delete(requestId);
        }
        
        return response;
      },
      (error) => {
        const requestId = error.config?.headers?.['X-Request-ID'] as string;
        console.error(`[HRM Client] [${requestId || 'unknown'}] Response error:`, error.message);
        
        // Clean up metadata
        if (requestId) {
          this.requestMetadata.delete(requestId);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get timeout for specific endpoint
   */
  private getTimeoutForEndpoint(endpoint: string): number {
    const timeouts: { [key: string]: number } = {
      '/analyze-reasoning': 30000,
      '/optimize-schedule': 45000,
      '/generate-quiz': 60000,
      '/warmup': 120000,
      '/health': 5000
    };

    // Find matching endpoint
    const matchingEndpoint = Object.keys(timeouts).find(key => endpoint.includes(key));
    return matchingEndpoint ? timeouts[matchingEndpoint] : this.config.timeout;
  }

  /**
   * Check if circuit breaker is open for endpoint
   */
  private isCircuitOpen(endpoint: string): boolean {
    const breaker = this.circuitBreakers.get(endpoint);
    if (!breaker) return false;

    // Reset circuit breaker if it's been 5 minutes since last failure
    if (Date.now() - breaker.lastFailure.getTime() > 300000) {
      this.circuitBreakers.delete(endpoint);
      return false;
    }

    return breaker.open;
  }

  /**
   * Handle circuit breaker logic
   */
  private handleCircuitBreaker(endpoint: string, error: Error | unknown): void {
  const breaker = this.circuitBreakers.get(endpoint) || {
    open: false,
    failures: 0,
    lastFailure: new Date()
  };

  breaker.failures++;
  breaker.lastFailure = new Date();

  // Open circuit breaker after 3 consecutive failures
  if (breaker.failures >= 3) {
    breaker.open = true;
    console.error(`[HRM Client] Circuit breaker opened for ${endpoint} after ${breaker.failures} failures. Error: ${this.getErrorMessage(error)}`);
  }

    this.circuitBreakers.set(endpoint, breaker);
  }

  /**
   * Analyze reasoning pattern using HRM
   */
  async analyzeReasoning(request: ReasoningRequest): Promise<ReasoningResponse> {
    const endpoint = '/analyze-reasoning';
    await this.ensureServiceHealth();

    if (this.isCircuitOpen(endpoint)) {
      throw new Error(`HRM service circuit breaker is open for ${endpoint} - service unavailable`);
    }

    try {
      const response: AxiosResponse<ReasoningResponse> = await this.retryRequest(
        () => this.client.post<ReasoningResponse>(endpoint, request)
      );

      // Validate response structure
      this.validateReasoningResponse(response.data);
      
      // Reset circuit breaker on success
      this.circuitBreakers.delete(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('HRM reasoning analysis failed:', error);
      this.handleCircuitBreaker(endpoint, error);
      throw new Error(`Failed to analyze reasoning pattern: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Generate optimized review schedule
   */
  async optimizeSchedule(request: AdaptiveScheduleRequest): Promise<AdaptiveScheduleResponse> {
    const endpoint = '/optimize-schedule';
    await this.ensureServiceHealth();

    if (this.isCircuitOpen(endpoint)) {
      throw new Error(`HRM service circuit breaker is open for ${endpoint} - service unavailable`);
    }

    try {
      const response: AxiosResponse<AdaptiveScheduleResponse> = await this.retryRequest(
        () => this.client.post<AdaptiveScheduleResponse>(endpoint, request)
      );

      this.circuitBreakers.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('HRM schedule optimization failed:', error);
      this.handleCircuitBreaker(endpoint, error);
      throw new Error(`Failed to optimize schedule: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Generate adaptive quiz questions
   */
  async generateQuiz(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
    const endpoint = '/generate-quiz';
    await this.ensureServiceHealth();

    if (this.isCircuitOpen(endpoint)) {
      throw new Error(`HRM service circuit breaker is open for ${endpoint} - service unavailable`);
    }

    try {
      const response: AxiosResponse<QuizGenerationResponse> = await this.retryRequest(
        () => this.client.post<QuizGenerationResponse>(endpoint, request)
      );

      this.circuitBreakers.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('HRM quiz generation failed:', error);
      this.handleCircuitBreaker(endpoint, error);
      throw new Error(`Failed to generate quiz: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Batch analyze multiple reasoning patterns
   */
  async batchAnalyzeReasoning(requests: ReasoningRequest[]): Promise<ReasoningResponse[]> {
    const endpoint = '/batch-analyze-reasoning';
    await this.ensureServiceHealth();

    if (this.isCircuitOpen(endpoint)) {
      throw new Error(`HRM service circuit breaker is open for ${endpoint} - service unavailable`);
    }

    try {
      const response: AxiosResponse<{ results: ReasoningResponse[] }> = await this.retryRequest(
        () => this.client.post<{ results: ReasoningResponse[] }>(endpoint, {
          requests: requests
        })
      );

      this.circuitBreakers.delete(endpoint);
      return response.data.results;
    } catch (error) {
      console.error('HRM batch analysis failed:', error);
      this.handleCircuitBreaker(endpoint, error);
      throw new Error(`Failed to batch analyze reasoning: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Health check for HRM service with caching
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const now = Date.now();
    const cacheAge = now - this.healthCheckCache.timestamp;

    // Return cached result if less than 30 seconds old
    if (this.healthCheckCache.status && cacheAge < 30000) {
      return this.healthCheckCache.status;
    }

    try {
      const response: AxiosResponse<HealthCheckResponse> = await this.client.get('/health');
      
      this.healthCheckCache = {
        status: response.data,
        timestamp: now
      };
      
      this.lastHealthCheck = new Date();
      
      return response.data;
    } catch (error) {
      console.error('HRM health check failed:', error);
      
      // Mark all circuit breakers as open on health check failure
      this.circuitBreakers.forEach((breaker) => {
        breaker.open = true;
      });
      
      throw new Error(`Health check failed: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<ServiceStats> {
    try {
      const response = await this.client.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get HRM service stats:', error);
      throw new Error(`Failed to get service stats: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Warm up the HRM model (useful after deployment)
   */
  async warmupModel(): Promise<{ success: boolean; warmup_time_ms: number }> {
    const endpoint = '/warmup';
    
    try {
      const response = await this.client.post(endpoint, {});
      return response.data;
    } catch (error) {
      console.error('HRM model warmup failed:', error);
      throw new Error(`Model warmup failed: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Ensure service is healthy before making requests
   */
  private async ensureServiceHealth(): Promise<void> {
    const now = new Date();
    const timeSinceLastCheck = this.lastHealthCheck 
      ? now.getTime() - this.lastHealthCheck.getTime()
      : Infinity;

    // Check health if it's been more than 5 minutes or if any circuit breaker is open
const anyCircuitOpen = Array.from(this.circuitBreakers.values()).some(breaker => breaker.open);

if (timeSinceLastCheck > this.healthCheckInterval || anyCircuitOpen) {
  try {
    await this.healthCheck();
  } catch (error) {
    console.warn('Health check failed, proceeding with degraded service. Error:', this.getErrorMessage(error));
  }
}

  }

  /**
   * Retry mechanism for failed requests with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    let lastError: Error | unknown;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (axios.isAxiosError(error) && error.response?.status && error.response.status < 500) {
          throw error;
        }

        if (attempt < this.config.retryAttempts) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          console.log(`[HRM Client] Retry attempt ${attempt} after ${backoffDelay}ms`);
          await this.delay(backoffDelay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Validate reasoning response structure
   */
  private validateReasoningResponse(response: ReasoningResponse): void {
    const requiredFields = [
      'reasoning_depth',
      'pattern_recognition',
      'cognitive_load',
      'recommended_difficulty',
      'learning_insights',
      'adaptive_factors'
    ];

    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Invalid HRM response: missing field '${field}'`);
      }
    }

    // Validate numeric ranges
    const numericFields = [
      { field: 'reasoning_depth', value: response.reasoning_depth },
      { field: 'pattern_recognition', value: response.pattern_recognition },
      { field: 'cognitive_load', value: response.cognitive_load }
    ];

    for (const { field, value } of numericFields) {
      if (typeof value !== 'number' || value < 0 || value > 1) {
        throw new Error(`Invalid ${field} value: must be a number between 0 and 1`);
      }
    }
  }

  /**
   * Extract error message from various error types
   */
  private getErrorMessage(error: Error | unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.detail) {
        return error.response.data.detail;
      }
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.message) {
        return error.message;
      }
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'Unknown error occurred';
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Close circuit breaker manually (for testing or manual recovery)
   */
  closeCircuitBreaker(endpoint?: string): void {
    if (endpoint) {
      this.circuitBreakers.delete(endpoint);
      console.log(`[HRM Client] Circuit breaker manually closed for ${endpoint}`);
    } else {
      this.circuitBreakers.clear();
      console.log('[HRM Client] All circuit breakers manually closed');
    }
  }

  /**
   * Check if service is available
   */
  isServiceAvailable(): boolean {
    return !Array.from(this.circuitBreakers.values()).some(breaker => breaker.open);
  }

  /**
   * Get current service status
   */
  getServiceStatus(): {
    available: boolean;
    last_health_check: Date | null;
    circuit_breakers: { [endpoint: string]: { open: boolean; failures: number; last_failure: Date } };
    cached_health_status: HealthCheckResponse | null;
  } {
    const circuitBreakerStatus: { [endpoint: string]: { open: boolean; failures: number; last_failure: Date } } = {};
    
    this.circuitBreakers.forEach((breaker, endpoint) => {
      circuitBreakerStatus[endpoint] = {
        open: breaker.open,
        failures: breaker.failures,
        last_failure: breaker.lastFailure
      };
    });

    return {
      available: this.isServiceAvailable(),
      last_health_check: this.lastHealthCheck,
      circuit_breakers: circuitBreakerStatus,
      cached_health_status: this.healthCheckCache.status
    };
  }
}

// Create singleton instance
export const hrmClient = new HRMClient();

// Export fallback utilities for when HRM service is unavailable
export const HRMFallbacks = {
  
  /**
   * Generate fallback reasoning response when HRM is unavailable
   */
  generateFallbackReasoning: (
    quality: number,
    responseTime: number,
    confidence: number
  ): ReasoningResponse => {
    return {
      reasoning_depth: Math.max(0, Math.min(1, quality / 5)),
      pattern_recognition: Math.max(0, Math.min(1, confidence)),
      cognitive_load: Math.max(0, Math.min(1, responseTime / 60000)), // Normalize to 1 minute
      recommended_difficulty: Math.max(0.1, Math.min(1, quality / 5)),
      learning_insights: {
        reasoning_strengths: quality >= 4 ? ['Good recall ability'] : [],
        improvement_areas: quality < 3 ? ['Needs more practice'] : [],
        study_recommendations: quality < 3 ? ['Review fundamentals'] : ['Continue regular practice'],
        optimal_study_time: 30
      },
      adaptive_factors: {
        difficulty_multiplier: 1.0,
        interval_adjustment: quality >= 3 ? 1.0 : 0.8,
        confidence_factor: confidence,
        retention_prediction: Math.max(0, Math.min(1, quality / 5))
      },
      processing_time_ms: 0
    };
  },

  /**
   * Check if fallback should be used
   */
  shouldUseFallback: (): boolean => {
    return !hrmClient.isServiceAvailable();
  }
};

// Export configuration for easy setup
export const HRMClientConfig = {
  
  /**
   * Configure HRM client for different environments
   */
  configure: (config: {
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  }) => {
    if (config.baseUrl) {
      process.env.HRM_SERVICE_URL = config.baseUrl;
    }
    if (config.timeout) {
      process.env.HRM_TIMEOUT = config.timeout.toString();
    }
    if (config.retryAttempts) {
      process.env.HRM_RETRY_ATTEMPTS = config.retryAttempts.toString();
    }
  },

  /**
   * Get recommended configuration for different environments
   */
  getEnvironmentConfig: (env: 'development' | 'staging' | 'production') => {
    switch (env) {
      case 'development':
        return {
          baseUrl: 'http://localhost:8000',
          timeout: 30000,
          retryAttempts: 2
        };
      case 'staging':
        return {
          baseUrl: process.env.HRM_SERVICE_URL || 'https://hrm-staging.kanchen-academy.com',
          timeout: 45000,
          retryAttempts: 3
        };
      case 'production':
        return {
          baseUrl: process.env.HRM_SERVICE_URL || 'https://hrm.kanchen-academy.com',
          timeout: 60000,
          retryAttempts: 3
        };
      default:
        return {
          baseUrl: 'http://localhost:8000',
          timeout: 30000,
          retryAttempts: 3
        };
    }
  }
};
