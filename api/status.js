// Reports which integrations are configured — booleans only, never values.
// Lets the Home screen show honest Live / Needs-key states.
export default function handler(req, res) {
  res.status(200).json({
    daytona: Boolean(process.env.DAYTONA_API_KEY),
    outpostSnapshot: Boolean(process.env.DAYTONA_SNAPSHOT),
    grok: Boolean(process.env.XAI_API_KEY),
    claude: Boolean(process.env.ANTHROPIC_API_KEY),
    x: Boolean(process.env.X_BEARER_TOKEN),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY)
  });
}
