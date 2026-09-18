import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Access Denied: Admin role required." }, { status: 403 });
    }

    const docRef = await db.collection("system_settings").doc("payment").get();
    const provider = docRef.exists ? (docRef.data()?.provider || "paddle") : (process.env.PAYMENT_PROVIDER || "paddle");

    return NextResponse.json({ provider });
  } catch (error: any) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Access Denied: Admin role required." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const provider = body.provider === "stripe" ? "stripe" : "paddle";

    await db.collection("system_settings").doc("payment").set(
      {
        provider: provider,
        updatedAt: new Date(),
        updatedBy: user.email || user.id,
      },
      { merge: true }
    );

    console.log(`[Admin] Payment Gateway switched to ${provider} by ${user.email}`);

    return NextResponse.json({ success: true, provider });
  } catch (error: any) {
    console.error("Error updating payment settings:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
