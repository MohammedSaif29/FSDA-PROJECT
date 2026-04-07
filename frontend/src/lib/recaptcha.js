const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
let scriptPromise;

function loadScript() {
  if (!siteKey) {
    return Promise.resolve(null);
  }

  if (window.grecaptcha?.enterprise || window.grecaptcha) {
    return Promise.resolve(window.grecaptcha.enterprise || window.grecaptcha);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.grecaptcha?.enterprise || window.grecaptcha || null);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getRecaptchaToken(action) {
  if (!siteKey) {
    return null;
  }

  const grecaptcha = await loadScript();
  if (!grecaptcha) {
    return null;
  }

  return new Promise((resolve, reject) => {
    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(siteKey, { action });
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export const isRecaptchaEnabled = Boolean(siteKey);
