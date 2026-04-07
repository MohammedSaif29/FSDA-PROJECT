import { findUserById } from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';

export async function authenticate(request, response, next) {
  try {
    const authorizationHeader = request.headers.authorization || '';
    const token = authorizationHeader.startsWith('Bearer ')
      ? authorizationHeader.slice(7)
      : null;

    if (!token) {
      return response.status(401).json({ error: 'Authentication required.' });
    }

    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.sub);

    if (!user) {
      return response.status(401).json({ error: 'User not found.' });
    }

    request.user = user;
    next();
  } catch {
    return response.status(401).json({ error: 'Invalid or expired access token.' });
  }
}

export function authorize(...roles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(request.user.role)) {
      return response.status(403).json({ error: 'You are not allowed to access this resource.' });
    }

    next();
  };
}
