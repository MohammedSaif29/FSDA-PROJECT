import crypto from 'crypto';

export const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

export const hashToken = (value) => crypto.createHash('sha256').update(value).digest('hex');
