import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { apiKeyManager } from "@/lib/apiKeyManager";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";

    if (!user || !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await apiKeyManager.refreshAllLimits();
    const statuses = apiKeyManager.getKeysStatus();
    return NextResponse.json(statuses);
  } catch (error: any) {
    console.error("Failed to fetch API key stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
