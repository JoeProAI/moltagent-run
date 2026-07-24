import { ConvexReactClient } from "convex/react";

// Convex DB Live URL from .env.local
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://acoustic-lyrebird-183.convex.cloud";

export const convex = new ConvexReactClient(CONVEX_URL);
export { CONVEX_URL };
