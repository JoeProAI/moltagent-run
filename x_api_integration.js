/**
 * X Growth Multiplier — live X API v2 connector for @JoePro.
 * Calls the /api/x-metrics serverless proxy: browsers can't hit
 * api.twitter.com directly (CORS), so the fetch happens server-side.
 */

export class XGrowthMultiplier {
  constructor(bearerToken = null) {
    this.bearerToken = bearerToken || (import.meta.env ? import.meta.env.VITE_X_BEARER_TOKEN : null);
  }

  async fetchLiveAccountMetrics(username = 'JoePro') {
    try {
      const response = await fetch('/api/x-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bearerToken: this.bearerToken, username })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP_${response.status}`,
          message: result.message || `X API proxy error (${response.status})`
        };
      }
      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message,
        message: `Failed to reach the X metrics proxy: ${err.message}. In local dev, run "vercel dev" so /api routes exist.`
      };
    }
  }

  async generateHooks(topic, count = 25) {
    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        return { success: false, message: result.message || `Hook API error (${response.status})` };
      }
      return result;
    } catch (err) {
      return { success: false, message: `Failed to reach the hook generator: ${err.message}` };
    }
  }
}

export default XGrowthMultiplier;
