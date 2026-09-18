import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { apiKeyManager } from "@/lib/apiKeyManager";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const modelName = body.model;

    if (!modelName) {
      return NextResponse.json({ error: "Model name is required" }, { status: 400 });
    }

    // Return cached metrics from the key manager instead of making a live API call.
    // The apiKeyManager already tracks remaining tokens/requests from every real
    // fetchGroq() call, so we can serve this data without wasting API quota.
    const keysStatus = apiKeyManager.getKeysStatus();
    const aggregated = {
      "x-ratelimit-remaining-tokens": String(keysStatus.reduce((s, k) => s + k.remainingTokens, 0)),
      "x-ratelimit-remaining-requests": String(keysStatus.reduce((s, k) => s + k.remainingRequests, 0)),
      "x-ratelimit-limit-tokens": String(keysStatus.reduce((s, k) => s + k.limitTokens, 0)),
      "x-ratelimit-limit-requests": String(keysStatus.reduce((s, k) => s + k.limitRequests, 0)),
    };

    return NextResponse.json({
      statusCode: 200,
      limits: aggregated,
      error: null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
