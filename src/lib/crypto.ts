import crypto from 'crypto';

/**
 * Computes a standard SHA-256 hex digest of any string or Buffer.
 */
export function sha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generates an immutable, cryptographic signature for an audit trail event.
 */
export function generateAuditSignature(payload: {
  contractId: string;
  milestoneId?: string | null;
  action: string;
  timestamp: string;
  details: string;
  actor: string;
}): string {
  const canonicalString = `${payload.contractId}:${payload.milestoneId || 'ROOT'}:${payload.action}:${payload.timestamp}:${payload.details}:${payload.actor}`;
  return sha256(canonicalString);
}

/**
 * Generates a cryptographically secure random token (e.g. for download session tokens).
 */
export function generateSecureToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}