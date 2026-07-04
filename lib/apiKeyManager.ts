interface ApiKeyInfo {
  key: string;
  remainingTokens: number;
  remainingRequests: number;
  resetTokensAt: number; // timestamp in ms
  resetRequestsAt: number; // timestamp in ms
  blockedUntil: number; // timestamp in ms
}

class ApiKeyManager {
  private keys: ApiKeyInfo[] = [];

  constructor() {
    this.loadKeys();
  }

  private loadKeys() {
    const foundKeys: string[] = [];
    
    // Scan up to 50 potential keys configured in the environment
    for (let i = 1; i <= 50; i++) {
      const name = i === 1 ? "GROQ_API_KEY" : `GROQ_API_KEY_${i}`;
      const val = process.env[name];
      if (val && val.trim()) {
        foundKeys.push(val.trim());
      }
    }

    this.keys = foundKeys.map(k => ({
      key: k,
      remainingTokens: 100000,
      remainingRequests: 1000,
      resetTokensAt: 0,
      resetRequestsAt: 0,
      blockedUntil: 0
    }));

    console.log(`[ApiKeyManager] Initialized with ${this.keys.length} active API keys.`);
  }

  public getBestKey(): string {
    const now = Date.now();
    
    // Re-check and clear expired blocks
    let activeKeys = this.keys.filter(k => k.blockedUntil < now);

    // If all keys are currently blocked, fallback to whichever key resets first
    if (activeKeys.length === 0) {
      activeKeys = [...this.keys].sort((a, b) => a.blockedUntil - b.blockedUntil);
    }

    // Sort active keys by remaining tokens descending, then remaining requests descending
    activeKeys.sort((a, b) => {
      if (b.remainingTokens !== a.remainingTokens) {
        return b.remainingTokens - a.remainingTokens;
      }
      return b.remainingRequests - a.remainingRequests;
    });

    return activeKeys[0]?.key || "";
  }

  public blockKey(key: string, durationSec = 60) {
    const info = this.keys.find(k => k.key === key);
    if (info) {
      info.blockedUntil = Date.now() + durationSec * 1000;
      info.remainingTokens = 0;
      info.remainingRequests = 0;
      console.warn(`[ApiKeyManager] Blocked key ending in ...${key.slice(-6)} for ${durationSec}s.`);
    }
  }

  public updateLimits(key: string, headers: Headers) {
    const info = this.keys.find(k => k.key === key);
    if (!info) return;

    const remainingTokens = headers.get("x-ratelimit-remaining-tokens");
    const remainingRequests = headers.get("x-ratelimit-remaining-requests");
    const resetTokens = headers.get("x-ratelimit-reset-tokens");
    const resetRequests = headers.get("x-ratelimit-reset-requests");

    if (remainingTokens !== null) {
      info.remainingTokens = parseInt(remainingTokens, 10);
    }
    if (remainingRequests !== null) {
      info.remainingRequests = parseInt(remainingRequests, 10);
    }

    const parseResetTime = (timeStr: string | null): number => {
      if (!timeStr) return 0;
      let ms = 0;
      const secMatch = timeStr.match(/([\d.]+)\s*s/);
      const msMatch = timeStr.match(/([\d.]+)\s*ms/);
      const minMatch = timeStr.match(/([\d.]+)\s*m/);

      if (secMatch) ms += parseFloat(secMatch[1]) * 1000;
      if (msMatch) ms += parseFloat(msMatch[1]);
      if (minMatch) ms += parseFloat(minMatch[1]) * 60000;

      return ms;
    };

    if (resetTokens) {
      info.resetTokensAt = Date.now() + parseResetTime(resetTokens);
    }
    if (resetRequests) {
      info.resetRequestsAt = Date.now() + parseResetTime(resetRequests);
    }
  }
}

export const apiKeyManager = new ApiKeyManager();

/**
 * Robust wrapper around fetch for Groq API that handles dynamic load-balancing,
 * parses rate-limit headers, and automatically fails over to the next best key
 * in case of a 429 Too Many Requests response or API error.
 */
export async function fetchGroq(path: string, options: RequestInit = {}): Promise<Response> {
  const maxRetries = apiKeyManager.getBestKey() ? 5 : 1;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const key = apiKeyManager.getBestKey();
    if (!key) {
      throw new Error("No active Groq API keys available.");
    }

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${key}`);

    const url = path.startsWith("http") ? path : `https://api.groq.com/openai/v1${path}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Update remaining tokens/requests metrics from headers
      apiKeyManager.updateLimits(key, response.headers);

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const blockDuration = retryAfter ? parseInt(retryAfter, 10) : 60;
        apiKeyManager.blockKey(key, blockDuration);
        console.warn(`[fetchGroq] Key ending in ...${key.slice(-6)} hit 429. Failover to next key.`);
        lastError = new Error(`Rate limit exceeded (429) for key ending in ...${key.slice(-6)}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.clone().text();
        console.warn(`[fetchGroq] Key error (status ${response.status}): ${errText}`);
        if (response.status === 400 && errText.includes("model_terms_required")) {
          apiKeyManager.blockKey(key, 600); // Block this key for 10 minutes
          lastError = new Error(`Terms required for model for key ending in ...${key.slice(-6)}: ${errText}`);
          continue;
        }
        if (response.status >= 500) {
          apiKeyManager.blockKey(key, 15);
          lastError = new Error(`Groq Server Error (${response.status}): ${errText}`);
          continue;
        }
      }

      return response;
    } catch (err: any) {
      console.error(`[fetchGroq] Network/fetch error with key ending in ...${key.slice(-6)}:`, err);
      apiKeyManager.blockKey(key, 15);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to execute Groq request after retrying active keys.");
}
