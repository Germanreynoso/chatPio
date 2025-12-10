interface ErrorLog {
  timestamp: string;
  service: string;
  error: string;
  details?: any;
  userId?: string;
  retryCount?: number;
}

// Global error notification function - will be set by the context
let globalErrorNotifier: ((message?: string) => void) | null = null;

export const setGlobalErrorNotifier = (notifier: (message?: string) => void) => {
  globalErrorNotifier = notifier;
};

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private readonly maxLogs = 1000;

  logError(service: string, error: any, details?: any, userId?: string, retryCount?: number) {
    const logEntry: ErrorLog = {
      timestamp: new Date().toISOString(),
      service,
      error: error instanceof Error ? error.message : String(error),
      details,
      userId,
      retryCount
    };

    this.logs.unshift(logEntry); // Add to beginning

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Also log to console for development
    console.error(`[${service}] Error:`, logEntry);

    // Always trigger global error notification for ANY error
    if (globalErrorNotifier) {
      globalErrorNotifier("Servicio momentáneamente no disponible");
    }

    // Check if this is a repeated failure that needs notification
    this.checkForRepeatedFailures(service);
  }

  private checkForRepeatedFailures(service: string) {
    const recentLogs = this.logs.filter(log =>
      log.service === service &&
      new Date(log.timestamp).getTime() > Date.now() - 5 * 60 * 1000 // Last 5 minutes
    );

    if (recentLogs.length >= 3) {
      // Trigger notification to technical team
      this.notifyTechnicalTeam(service, recentLogs);
    }
  }

  private async notifyTechnicalTeam(service: string, recentLogs: ErrorLog[]) {
    try {
      const { sendErrorNotification } = await import('../services/emailNotificationService');
      await sendErrorNotification(service, recentLogs);
    } catch (notifyError) {
      console.error('Failed to send error notification:', notifyError);
    }
  }

  getLogs(service?: string, limit = 100): ErrorLog[] {
    let filteredLogs = service ? this.logs.filter(log => log.service === service) : this.logs;
    return filteredLogs.slice(0, limit);
  }

  getServiceStatus(): Record<string, { status: 'operational' | 'degraded' | 'down'; lastError?: string }> {
    const services = ['video-generation', 'avatar-video-generation', 'synthesia-video-generation', 'image-generation', 'chat'];
    const status: Record<string, any> = {};

    services.forEach(service => {
      const recentLogs = this.logs.filter(log =>
        log.service === service &&
        new Date(log.timestamp).getTime() > Date.now() - 10 * 60 * 1000 // Last 10 minutes
      );

      if (recentLogs.length === 0) {
        status[service] = { status: 'operational' as const };
      } else if (recentLogs.length < 3) {
        status[service] = { status: 'degraded' as const, lastError: recentLogs[0].error };
      } else {
        status[service] = { status: 'down' as const, lastError: recentLogs[0].error };
      }
    });

    return status;
  }

  clearLogs(service?: string) {
    if (service) {
      this.logs = this.logs.filter(log => log.service !== service);
    } else {
      this.logs = [];
    }
  }
}

export const errorLogger = new ErrorLogger();