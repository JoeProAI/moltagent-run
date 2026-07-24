// Vercel serverless proxy for X API v2. Browsers can't call api.twitter.com
// directly (CORS), so the token travels here and the fetch happens server-side.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST only' });
  }

  const { bearerToken, username = 'JoePro' } = req.body || {};
  const token = bearerToken || process.env.X_BEARER_TOKEN;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'NO_TOKEN',
      message: 'Provide an X API v2 bearer token, or set X_BEARER_TOKEN in Vercel env.'
    });
  }

  if (!/^[A-Za-z0-9_]{1,15}$/.test(username)) {
    return res.status(400).json({ success: false, message: 'Invalid username.' });
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,description,profile_image_url`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      const detail = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `X_API_${response.status}`,
        message: `X API error ${response.status}: ${detail.slice(0, 200)}`
      });
    }

    const data = await response.json();
    const metrics = data.data?.public_metrics;

    return res.status(200).json({
      success: true,
      handle: `@${data.data.username}`,
      name: data.data.name,
      followersCount: metrics?.followers_count || 0,
      followingCount: metrics?.following_count || 0,
      tweetCount: metrics?.tweet_count || 0,
      listedCount: metrics?.listed_count || 0,
      profileImageUrl: data.data.profile_image_url
    });
  } catch (err) {
    return res.status(502).json({ success: false, message: `Proxy error: ${err.message}` });
  }
}
