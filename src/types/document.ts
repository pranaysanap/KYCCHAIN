export interface Document {
  id: string;
  userId: string;
  type: 'passport' | 'id' | 'license' | 'other';
  fileName: string;
  sha256Hash: string;
  blockchainTxHash?: string;
  status: 'pending' | 'verified' | 'flagged' | 'rejected';
  uploadedAt: string;
  aiScore?: number;
  fraudFlags?: string[];
  verifiedBy?: string;
  verifiedAt?: string;
  encryptedUrl?: string;
}

export interface Consent {
  id: string;
  userId: string;
  bankId: string;
  bankName: string;
  status: 'active' | 'revoked';
  grantedAt: string;
  revokedAt?: string;
  blockchainTxHash?: string;
}

export interface FraudAlert {
  id: string;
  documentId: string;
  userId: string;
  severity: 'low' | 'medium' | 'high';
  anomalyScore: number;
  reasons: string[];
  aiReport: {
    forgeryProbability: number;
    duplicateDetection: boolean;
    faceMismatch?: boolean;
    tamperedImage: boolean;
  };
  createdAt: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}