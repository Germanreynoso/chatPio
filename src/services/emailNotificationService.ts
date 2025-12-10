import { API_CONFIG, ENV } from '../config/api';
import { errorLogger } from '../utils/errorLogger';

interface ErrorLog {
  timestamp: string;
  service: string;
  error: string;
  details?: any;
  userId?: string;
  retryCount?: number;
}

export async function sendErrorNotification(service: string, recentLogs: ErrorLog[]): Promise<void> {
  try {
    const notificationData = {
      subject: `Alerta: Múltiples fallos en ${service}`,
      message: generateErrorNotificationMessage(service, recentLogs),
      service,
      errorCount: recentLogs.length,
      firstErrorTime: recentLogs[recentLogs.length - 1]?.timestamp,
      lastErrorTime: recentLogs[0]?.timestamp,
      logs: recentLogs.slice(0, 5) // Include last 5 errors
    };

    // For now, we'll log the notification. In production, this would send an email
    // You can integrate with services like SendGrid, Mailgun, or your email API
    console.warn('ERROR NOTIFICATION:', notificationData);

    // TODO: Replace with actual email sending logic
    // Example with a webhook:
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notificationData)
    // });

    // For development, you could send to a logging service or Slack webhook
    await sendToDevelopmentWebhook(notificationData);

  } catch (error) {
    console.error('Failed to send error notification:', error);
    errorLogger.logError('email-notification', error, { service, recentLogs });
  }
}

function generateErrorNotificationMessage(service: string, recentLogs: ErrorLog[]): string {
  const serviceNames: Record<string, string> = {
    'video-generation': 'Generación de Vídeo',
    'avatar-video-generation': 'Generación de Vídeo con Avatar',
    'synthesia-video-generation': 'Generación de Vídeo con Synthesia',
    'image-generation': 'Generación de Imágenes',
    'chat': 'Chat'
  };

  const displayName = serviceNames[service] || service;

  let message = `🚨 ALERTA DE SISTEMA\n\n`;
  message += `Servicio afectado: ${displayName}\n`;
  message += `Número de errores recientes: ${recentLogs.length}\n`;
  message += `Primer error: ${new Date(recentLogs[recentLogs.length - 1]?.timestamp).toLocaleString('es-ES')}\n`;
  message += `Último error: ${new Date(recentLogs[0]?.timestamp).toLocaleString('es-ES')}\n\n`;

  message += `Últimos errores:\n`;
  recentLogs.slice(0, 3).forEach((log, index) => {
    message += `${index + 1}. ${log.error}\n`;
    if (log.userId) message += `   Usuario: ${log.userId}\n`;
    if (log.retryCount) message += `   Reintentos: ${log.retryCount}\n`;
  });

  message += `\nPor favor, revisa los logs del sistema y verifica el estado del servicio externo.\n`;
  message += `Accede al panel de administración para más detalles.`;

  return message;
}

async function sendToDevelopmentWebhook(notificationData: any): Promise<void> {
  // In development, you could send to a Slack webhook or logging service
  // For now, just log it
  if (ENV.DEBUG) {
    console.log('Development webhook would send:', notificationData);
  }

  // Example Slack webhook (replace with your actual webhook URL)
  // const SLACK_WEBHOOK_URL = process.env.VITE_SLACK_WEBHOOK_URL;
  // if (SLACK_WEBHOOK_URL) {
  //   await fetch(SLACK_WEBHOOK_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       text: notificationData.message,
  //       username: 'System Monitor',
  //       icon_emoji: ':warning:'
  //     })
  //   });
  // }
}

// Function to send general notifications (not just errors)
export async function sendGeneralNotification(subject: string, message: string): Promise<void> {
  try {
    const notificationData = {
      subject,
      message,
      type: 'general'
    };

    console.log('GENERAL NOTIFICATION:', notificationData);

    // Similar to error notification, implement actual sending logic here
    await sendToDevelopmentWebhook(notificationData);

  } catch (error) {
    console.error('Failed to send general notification:', error);
    errorLogger.logError('general-notification', error, { subject, message });
  }
}