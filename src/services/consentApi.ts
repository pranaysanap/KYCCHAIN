import { apiService } from './api';
import type { ConsentRecord } from './api';

// Get consents for the authenticated user
export async function getConsents(): Promise<ConsentRecord[]> {
  try {
    const data = await apiService.getConsents();
    return data;
  } catch (error) {
    console.error('API getConsents failed:', error);
    // Surface the error to the caller so UI shows a clear failure instead of using a mock
    throw error;
  }
}

// Grant consent to an institution
export async function grantConsent(institutionName: string): Promise<ConsentRecord> {
  try {
    const data = await apiService.grantConsent(institutionName);
    return data;
  } catch (error) {
    console.error('API grantConsent failed:', error);
    // Surface the error so the frontend does not pretend consent was persisted
    throw error;
  }
}

// Revoke consent from an institution
export async function revokeConsent(institutionName: string): Promise<ConsentRecord> {
  try {
    const data = await apiService.revokeConsent(institutionName);
    return data;
  } catch (error) {
    console.error('API revokeConsent failed:', error);
    throw error;
  }
}
