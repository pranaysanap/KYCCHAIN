// Mock API for document and consent management
let docs: any[] = [];
let consents: any[] = [] as any[];
let fraudAlerts: any[] = [] as any[];
let profileState: any = null as any;
let verificationStore: any = { users: [] as any[], histories: new Map<string, any[]>() };
let verificationLogs: any[] = [] as any[];

function getCurrentAuthUser(): any | null {
  try {
    const raw = localStorage.getItem('kycchain_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredProfile(): any | null {
  try {
    const raw = localStorage.getItem('kycchain_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Simulate MongoDB Atlas collection for documents per user
function getDocumentsKey(email: string): string {
  return `kycchain_documents_${email}`;
}

function loadUserDocuments(email: string): any[] {
  try {
    const key = getDocumentsKey(email);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserDocuments(email: string, documents: any[]): void {
  try {
    const key = getDocumentsKey(email);
    localStorage.setItem(key, JSON.stringify(documents));
  } catch (error) {
    console.error('Failed to save documents to database:', error);
  }
}

function saveUserDocument(email: string, document: any): void {
  const userDocs = loadUserDocuments(email);
  userDocs.unshift(document);
  saveUserDocuments(email, userDocs);
}

function updateUserDocument(email: string, docId: string, updates: any): void {
  const userDocs = loadUserDocuments(email);
  const index = userDocs.findIndex(doc => doc.documentId === docId);
  if (index !== -1) {
    userDocs[index] = { ...userDocs[index], ...updates };
    saveUserDocuments(email, userDocs);
  }
}

function deleteUserDocument(email: string, docId: string): boolean {
  const userDocs = loadUserDocuments(email);
  const filteredDocs = userDocs.filter(doc => doc.documentId !== docId);
  if (filteredDocs.length < userDocs.length) {
    saveUserDocuments(email, filteredDocs);
    return true;
  }
  return false;
}

// SHA-256 computation using Web Crypto API
export async function sha256Hex(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function postUpload(file: File, metadata: { type: string }): Promise<any> {
  // Check if user is authenticated
  const authUser = getCurrentAuthUser();
  if (!authUser || !authUser.email) {
    throw new Error('User not authenticated');
  }

  // Simulate upload delay
  await delay(1000);

  const sha = await sha256Hex(file);
  const doc: any = {
    documentId: 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    sha256: sha,
    fileName: file.name,
    type: metadata.type,
    status: 'processing',
    blockchainTx: null,
    aiReport: null,
    uploadedAt: new Date().toISOString(),
    fileSize: file.size,
    fileType: file.type,
    userEmail: authUser.email // Associate document with user
  };

  // Set status to uploaded immediately and add blockchain and AI report
  doc.status = 'uploaded';
  doc.blockchainTx = '0x' + Math.random().toString(16).substr(2, 64);
  doc.aiReport = {
    anomalyScore: Math.random() * 0.3, // Low anomaly score for demo
    forgeryProbability: Math.random() * 0.2,
    duplicateDetection: false,
    faceMismatch: false,
    tamperedImage: false,
    confidence: 0.95 + Math.random() * 0.05
  };

  // Save document to the shared collection
  saveUserDocument(authUser.email, doc);

  return JSON.parse(JSON.stringify(doc));
}

export async function getDocuments(): Promise<any[]> {
  // Check if user is authenticated
  const authUser = getCurrentAuthUser();
  if (!authUser || !authUser.email) {
    return [];
  }

  await delay(300); // Simulate API delay
  // Load user-specific documents from localStorage
  const userDocs = loadUserDocuments(authUser.email);
  return JSON.parse(JSON.stringify(userDocs));
}

export async function getDocument(id: string): Promise<any | null> {
  // Check if user is authenticated
  const authUser = getCurrentAuthUser();
  if (!authUser || !authUser.email) {
    return null;
  }

  await delay(200);
  // Load user-specific documents and find the one with the given id
  const userDocs = loadUserDocuments(authUser.email);
  const doc = userDocs.find(d => d.documentId === id);
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
}

export async function deleteDocument(id: string): Promise<boolean> {
  // Check if user is authenticated
  const authUser = getCurrentAuthUser();
  if (!authUser || !authUser.email) {
    return false;
  }

  await delay(500);
  // Delete document from the shared collection
  return deleteUserDocument(authUser.email, id);
}

// -------------------------------
// Consent Management (Mock)
// -------------------------------

export interface ConsentRecord {
  id: string;
  institutionName: string;
  status: 'granted' | 'revoked';
  lastUpdated: string;
}

export async function getConsents(): Promise<ConsentRecord[]> {
  await delay(300);
  // Return a deep copy
  return JSON.parse(JSON.stringify(consents));
}

export async function grantConsent(institutionName: string): Promise<ConsentRecord> {
  await delay(500);
  const existing = consents.find(c => c.institutionName.toLowerCase() === institutionName.toLowerCase());
  const timestamp = new Date().toISOString();

  if (existing) {
    // If exists and revoked, flip to granted; if already granted, throw
    if (existing.status === 'granted') {
      const err: any = new Error('Consent already granted for this institution');
      err.code = 'DUPLICATE_CONSENT';
      throw err;
    }
    existing.status = 'granted';
    existing.lastUpdated = timestamp;

    // Log consent grant event
    const authUser = getCurrentAuthUser();
    if (authUser) {
      const logEntry = {
        id: 'log-' + Date.now(),
        ts: timestamp,
        userId: authUser.email, // Using email as userId for mock
        userName: authUser.name || 'Unknown User',
        docType: null,
        action: 'consent_granted',
        admin: institutionName,
        tx: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0'),
        status: 'success'
      };
      verificationLogs.unshift(logEntry);
    }

    return JSON.parse(JSON.stringify(existing));
  }

  const record: ConsentRecord = {
    id: 'consent-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    institutionName,
    status: 'granted',
    lastUpdated: timestamp
  };
  consents.unshift(record);

  // Log consent grant event for new consent
  const authUser = getCurrentAuthUser();
  if (authUser) {
    const logEntry = {
      id: 'log-' + Date.now(),
      ts: timestamp,
      userId: authUser.email,
      userName: authUser.name || 'Unknown User',
      docType: null,
      action: 'consent_granted',
      admin: institutionName,
      tx: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0'),
      status: 'success'
    };
    verificationLogs.unshift(logEntry);
  }

  return JSON.parse(JSON.stringify(record));
}

export async function revokeConsent(institutionName: string): Promise<ConsentRecord> {
  await delay(500);
  const record = consents.find(c => c.institutionName.toLowerCase() === institutionName.toLowerCase());
  if (!record) {
    const err: any = new Error('Consent not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  record.status = 'revoked';
  record.lastUpdated = new Date().toISOString();
  return JSON.parse(JSON.stringify(record));
}

// -------------------------------
// Fraud Alerts (Mock)
// -------------------------------

export interface FraudAlertRecord {
  id: string;
  type: 'Document Tampering' | 'Multiple Access Attempts' | 'Suspicious Consent';
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'under_review' | 'resolved';
  timestamp: string;
  description: string;
  affected: { kind: 'document' | 'institution'; name: string };
  details: {
    documentSha256?: string;
    institutionName?: string;
    aiRiskScore: number; // 0-100
    blockchainVerification: 'No tampering detected' | 'Mismatch found' | 'Unable to verify';
  };
}

// Seed with a few demo alerts on first access
function ensureFraudSeed() {
  if (fraudAlerts.length > 0) return;
  const now = Date.now();
  fraudAlerts = [
    {
      id: 'fa-' + (now - 100000),
      type: 'Document Tampering',
      severity: 'high',
      status: 'new',
      timestamp: new Date(now - 100000).toISOString(),
      description: 'Possible modification detected in uploaded ID image metadata.',
      affected: { kind: 'document', name: 'ID_Card.jpg' },
      details: {
        documentSha256: 'f1b2c3...abcd',
        aiRiskScore: 86,
        blockchainVerification: 'Mismatch found'
      }
    },
    {
      id: 'fa-' + (now - 500000),
      type: 'Multiple Access Attempts',
      severity: 'medium',
      status: 'under_review',
      timestamp: new Date(now - 500000).toISOString(),
      description: 'Three rapid access attempts from unknown IPs in the last hour.',
      affected: { kind: 'institution', name: 'SBI Bank' },
      details: {
        institutionName: 'SBI Bank',
        aiRiskScore: 54,
        blockchainVerification: 'No tampering detected'
      }
    },
    {
      id: 'fa-' + (now - 2000000),
      type: 'Suspicious Consent',
      severity: 'low',
      status: 'resolved',
      timestamp: new Date(now - 2000000).toISOString(),
      description: 'Consent granted and revoked multiple times within a short period.',
      affected: { kind: 'institution', name: 'HDFC Bank' },
      details: {
        institutionName: 'HDFC Bank',
        aiRiskScore: 32,
        blockchainVerification: 'No tampering detected'
      }
    }
  ];
}

export async function getFraudAlerts(): Promise<FraudAlertRecord[]> {
  ensureFraudSeed();
  await delay(300);
  return JSON.parse(JSON.stringify(fraudAlerts));
}

export async function resolveAlert(id: string): Promise<FraudAlertRecord> {
  await delay(400);
  const item = fraudAlerts.find(a => a.id === id);
  if (!item) {
    const err: any = new Error('Alert not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  item.status = 'resolved';
  item.timestamp = new Date().toISOString();
  return JSON.parse(JSON.stringify(item));
}

export async function reportAlert(id: string): Promise<{ success: boolean }>{
  await delay(600);
  const exists = fraudAlerts.some(a => a.id === id);
  if (!exists) {
    const err: any = new Error('Alert not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return { success: true };
}

// -------------------------------
// Profile (Mock)
// -------------------------------

function ensureProfileSeed() {
  if (profileState) return;
  const auth = getCurrentAuthUser();
  const stored = getStoredProfile();
  profileState = stored || {
    user: {
      fullName: auth?.name || 'John Doe',
      email: auth?.email || 'john@example.com',
      phone: '+1 555-123-4567',
      address: '221B Baker Street, London',
      role: auth?.role || 'user',
      avatarUrl: ''
    },
    security: {
      twoFactorEnabled: false,
      sessions: [
        { id: 'sess-1', device: 'Chrome on Windows', location: 'London, UK', ip: '192.168.0.10', lastActive: new Date(Date.now() - 60_000).toISOString() },
        { id: 'sess-2', device: 'Safari on iPhone', location: 'London, UK', ip: '192.168.0.22', lastActive: new Date(Date.now() - 3_600_000).toISOString() }
      ]
    },
    preferences: {
      theme: 'dark',
      emailAlerts: true,
      fraudAlerts: true,
      language: 'en'
    },
    activity: [
      { id: 'act-1', timestamp: new Date(Date.now() - 300_000).toISOString(), action: 'Uploaded Passport', status: 'success', ip: '192.168.0.10' },
      { id: 'act-2', timestamp: new Date(Date.now() - 7200_000).toISOString(), action: 'Login', status: 'success', ip: '192.168.0.22' },
      { id: 'act-3', timestamp: new Date(Date.now() - 9000_000).toISOString(), action: 'Password Change Attempt', status: 'failed', ip: '192.168.0.10' }
    ]
  };
}

export async function getProfile(): Promise<any> {
  ensureProfileSeed();
  // Keep basic identity in sync with current auth user
  const auth = getCurrentAuthUser();
  if (auth) {
    profileState.user.fullName = auth.name || profileState.user.fullName;
    profileState.user.email = auth.email || profileState.user.email;
    profileState.user.role = auth.role || profileState.user.role;
  }
  await delay(300);
  try { localStorage.setItem('kycchain_profile', JSON.stringify(profileState)); } catch {}
  return JSON.parse(JSON.stringify(profileState));
}

export async function updateProfile(update: Partial<any>["user"]): Promise<any> {
  ensureProfileSeed();
  await delay(500);
  profileState.user = { ...profileState.user, ...update };
  // Sync minimal fields back to stored auth user
  try {
    const auth = getCurrentAuthUser();
    if (auth) {
      const updatedAuth = { ...auth };
      if (typeof update?.fullName === 'string') updatedAuth.name = update.fullName;
      if (typeof update?.email === 'string') updatedAuth.email = update.email;
      localStorage.setItem('kycchain_user', JSON.stringify(updatedAuth));
    }
    localStorage.setItem('kycchain_profile', JSON.stringify(profileState));
  } catch {}
  return JSON.parse(JSON.stringify(profileState.user));
}

export async function updatePreferences(update: Partial<any>["preferences"]): Promise<any> {
  ensureProfileSeed();
  await delay(400);
  profileState.preferences = { ...profileState.preferences, ...update };
  try { localStorage.setItem('kycchain_profile', JSON.stringify(profileState)); } catch {}
  return JSON.parse(JSON.stringify(profileState.preferences));
}

export async function updatePassword(current: string, next: string, confirm: string): Promise<{ success: boolean }>{
  await delay(600);
  if (!next || next !== confirm) {
    const err: any = new Error('Passwords do not match');
    err.code = 'VALIDATION';
    throw err;
  }
  if (next.length < 8) {
    const err: any = new Error('Password too short');
    err.code = 'WEAK_PASSWORD';
    throw err;
  }
  return { success: true };
}

export async function logoutSession(sessionId: string): Promise<{ success: boolean }>{
  ensureProfileSeed();
  await delay(300);
  profileState.security.sessions = profileState.security.sessions.filter((s: any) => s.id !== sessionId);
  return { success: true };
}

export async function deactivateAccount(): Promise<{ success: boolean }>{
  await delay(700);
  return { success: true };
}

export async function deleteAccount(): Promise<{ success: boolean }>{
  await delay(800);
  return { success: true };
}

// -------------------------------
// Verification (Mock)
// -------------------------------

type VerificationStatus = 'pending' | 'verified' | 'flagged';

function ensureVerificationSeed() {
  if (verificationStore.users.length > 0) return;
  const now = Date.now();
  verificationStore.users = [
    {
      id: 'u-1001',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      consentStatus: 'granted',
      verificationStatus: 'pending' as VerificationStatus,
      lastUpdated: new Date(now - 600000).toISOString(),
      documents: [
        {
          documentId: 'doc-a1',
          type: 'passport',
          fileName: 'passport_alice.pdf',
          sha256: 'a1b2c3...pass',
          blockchainTx: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0'),
          status: 'uploaded'
        },
        {
          documentId: 'doc-a2',
          type: 'id',
          fileName: 'id_alice.png',
          sha256: 'd4e5f6...id',
          blockchainTx: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0'),
          status: 'uploaded'
        }
      ]
    },
    {
      id: 'u-1002',
      fullName: 'Bob Singh',
      email: 'bob@example.com',
      consentStatus: 'revoked',
      verificationStatus: 'pending' as VerificationStatus,
      lastUpdated: new Date(now - 5600000).toISOString(),
      documents: [
        {
          documentId: 'doc-b1',
          type: 'license',
          fileName: 'license_bob.jpg',
          sha256: '112233...lic',
          blockchainTx: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0'),
          status: 'uploaded'
        }
      ]
    }
  ];
  verificationStore.users.forEach((u: any) => {
    verificationStore.histories.set(u.id, [
      { id: 'vh-' + u.id + '-1', date: new Date(now - 7200000).toISOString(), admin: 'Bank Admin', action: 'created', notes: 'User onboarded' }
    ]);
  });
}

export async function getUsers(query?: { q?: string; consent?: 'granted' | 'revoked' | 'all'; status?: VerificationStatus | 'all'; page?: number; pageSize?: number }): Promise<{ items: any[]; total: number }>{
  ensureVerificationSeed();
  await delay(300);
  const { q = '', consent = 'all', status = 'all', page = 1, pageSize = 10 } = query || {};
  let items = verificationStore.users.slice();
  const needle = q.toLowerCase();
  if (needle) {
    items = items.filter((u: any) =>
      u.id.toLowerCase().includes(needle) ||
      u.fullName.toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle)
    );
  }
  if (consent !== 'all') items = items.filter((u: any) => u.consentStatus === consent);
  if (status !== 'all') items = items.filter((u: any) => u.verificationStatus === status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: JSON.parse(JSON.stringify(paged)), total };
}

export async function getUserDocuments(userId: string): Promise<any[]> {
  ensureVerificationSeed();
  await delay(300);
  const u = verificationStore.users.find((x: any) => x.id === userId);
  return u ? JSON.parse(JSON.stringify(u.documents)) : [];
}

export async function verifyDocument(userId: string, docId: string): Promise<{ result: 'match' | 'mismatch'; blockchainTx: string }>{
  await delay(600);
  const u = verificationStore.users.find((x: any) => x.id === userId);
  const d = u?.documents.find((x: any) => x.documentId === docId);
  if (!u || !d) throw new Error('Document not found');
  // Mock: 85% chance of match
  const result = Math.random() < 0.85 ? 'match' : 'mismatch';
  return { result, blockchainTx: d.blockchainTx };
}

export async function analyzeFraud(userId: string, docId: string): Promise<{ score: number; status: 'safe' | 'suspicious' | 'fraud'; flags: string[] }>{
  await delay(1000);
  const score = Math.floor(20 + Math.random() * 70);
  let status: 'safe' | 'suspicious' | 'fraud' = 'safe';
  if (score > 75) status = 'fraud';
  else if (score > 50) status = 'suspicious';
  const flags: string[] = [];
  if (status !== 'safe') flags.push(status === 'fraud' ? 'Forgery indicators' : 'Low-quality scan');
  if (Math.random() < 0.3) flags.push('Duplicate usage across accounts');
  return { score, status, flags };
}

export async function updateVerification(userId: string, status: VerificationStatus): Promise<{ success: boolean }>{
  ensureVerificationSeed();
  await delay(500);
  const u = verificationStore.users.find((x: any) => x.id === userId);
  if (!u) throw new Error('User not found');
  u.verificationStatus = status;
  u.lastUpdated = new Date().toISOString();
  const list = verificationStore.histories.get(userId) || [];
  list.unshift({ id: 'vh-' + Date.now(), date: new Date().toISOString(), admin: 'Bank Admin', action: status, notes: '' });
  verificationStore.histories.set(userId, list);
  return { success: true };
}

export async function getVerificationHistory(userId: string): Promise<any[]>{
  ensureVerificationSeed();
  await delay(300);
  const list = verificationStore.histories.get(userId) || [];
  return JSON.parse(JSON.stringify(list));
}

// -------------------------------
// Verification Logs (Mock)
// -------------------------------

type LogAction = 'consent_granted' | 'consent_revoked' | 'approved' | 'flagged' | 'upload' | 'fraud_alert';

function ensureLogsSeed() {
  if (verificationLogs.length > 0) return;
  const now = Date.now();
  const randomTx = () => '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
  verificationLogs = [
    { id: 'log-1', ts: new Date(now - 120000).toISOString(), userId: 'u-1001', userName: 'Alice Johnson', docType: 'passport', action: 'approved', admin: 'Bank Admin', tx: randomTx(), status: 'success' },
    { id: 'log-2', ts: new Date(now - 720000).toISOString(), userId: 'u-1002', userName: 'Bob Singh', docType: 'license', action: 'consent_revoked', admin: 'SBI Admin', tx: randomTx(), status: 'warning' },
    { id: 'log-3', ts: new Date(now - 9600000).toISOString(), userId: 'u-1001', userName: 'Alice Johnson', docType: 'id', action: 'upload', admin: 'System', tx: randomTx(), status: 'success' },
    { id: 'log-4', ts: new Date(now - 3600000).toISOString(), userId: 'u-1002', userName: 'Bob Singh', docType: 'license', action: 'fraud_alert', admin: 'Monitor', tx: randomTx(), status: 'critical' },
  ];
}

export async function getVerificationLogs(params?: { q?: string; action?: LogAction | 'all'; from?: string; to?: string; page?: number; pageSize?: number }): Promise<{ items: any[]; total: number }>{
  ensureLogsSeed();
  await delay(300);
  const { q = '', action = 'all', from, to, page = 1, pageSize = 10 } = params || {};
  let items = verificationLogs.slice();
  const needle = q.toLowerCase();
  if (needle) {
    items = items.filter(l => l.userId.toLowerCase().includes(needle) || l.userName.toLowerCase().includes(needle) || l.admin.toLowerCase().includes(needle));
  }
  if (action !== 'all') items = items.filter(l => l.action === action);
  if (from) items = items.filter(l => new Date(l.ts).getTime() >= new Date(from).getTime());
  if (to) items = items.filter(l => new Date(l.ts).getTime() <= new Date(to).getTime());
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: JSON.parse(JSON.stringify(paged)), total };
}

export async function getLogDetails(logId: string): Promise<any> {
  ensureLogsSeed();
  await delay(300);
  const log = verificationLogs.find(l => l.id === logId);
  if (!log) throw new Error('Log not found');
  // mock expanded details
  return JSON.parse(JSON.stringify({
    ...log,
    user: { id: log.userId, name: log.userName, email: log.userId + '@example.com' },
    document: { sha256: 'deadbeef...'+log.id.slice(-4), tx: log.tx, status: log.status },
    description: `${log.action} performed by ${log.admin}`,
    fraud: log.action === 'fraud_alert' ? { score: 84, flags: ['Mismatch found', 'Duplicate usage'] } : null,
    etherscan: 'https://etherscan.io/tx/' + log.tx
  }));
}