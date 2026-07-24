/**
 * AETHER: X Growth Multiplier Real API Connector
 * Protocol: OAuth 2.0 PKCE & Twitter API v2
 * Target Account: @JoePro
 */

export class XGrowthMultiplier {
  constructor(bearerToken = null) {
    this.bearerToken = bearerToken || (import.meta.env ? import.meta.env.VITE_X_BEARER_TOKEN : null);
    this.baseUrl = 'https://api.twitter.com/2';
  }

  /**
   * Fetches real, live user metrics for @JoePro directly from X API v2
   */
  async fetchLiveAccountMetrics(username = 'JoePro') {
    if (!this.bearerToken) {
      console.warn('[X API] No VITE_X_BEARER_TOKEN set. Prompting user for live credentials.');
      return {
        success: false,
        error: 'NO_TOKEN_CONNECTED',
        message: 'Enter your X Developer Bearer Token to pull live @JoePro metrics.'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/by/username/${username}?user.fields=public_metrics,description,profile_image_url`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`X API HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const metrics = data.data?.public_metrics;

      return {
        success: true,
        handle: `@${data.data.username}`,
        name: data.data.name,
        followersCount: metrics?.followers_count || 0,
        followingCount: metrics?.following_count || 0,
        tweetCount: metrics?.tweet_count || 0,
        listedCount: metrics?.listed_count || 0,
        profileImageUrl: data.data.profile_image_url
      };
    } catch (err) {
      console.error('[X API] Live fetch error:', err);
      return {
        success: false,
        error: err.message,
        message: `Failed to fetch live @${username} data: ${err.message}`
      };
    }
  }
}

export default XGrowthMultiplier;
