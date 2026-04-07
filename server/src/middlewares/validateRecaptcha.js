import { config } from '../config.js';

export async function validateRecaptcha(request, response, next) {
  if (!config.recaptcha.secretKey) {
    next();
    return;
  }

  const recaptchaToken = request.body.recaptchaToken;

  if (!recaptchaToken) {
    return response.status(400).json({ error: 'reCAPTCHA verification is required.' });
  }

  try {
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: config.recaptcha.secretKey,
        response: recaptchaToken,
      }),
    });

    const result = await verificationResponse.json();

    if (!result.success || (typeof result.score === 'number' && result.score < config.recaptcha.minimumScore)) {
      return response.status(400).json({ error: 'reCAPTCHA validation failed.' });
    }

    next();
  } catch (error) {
    next(error);
  }
}
