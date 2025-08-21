// lib/lab-session.ts
export class LabSessionManager {
  private sessionId: string;
  private labId: string;
  
  constructor(labId: string) {
    this.labId = labId;
    this.sessionId = this.generateSessionId();
  }

  async saveSession(data: any) {
    await fetch('/api/labs/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        labId: this.labId,
        data
      })
    });
  }

  async loadSession(): Promise<any> {
    const response = await fetch(`/api/labs/sessions/${this.sessionId}`);
    return response.json();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}