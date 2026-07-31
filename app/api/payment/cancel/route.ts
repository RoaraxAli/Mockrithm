import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user record in Firestore to mark subscription cancellation requested
    await db.collection("users").doc(user.id).set(
      {
        subscriptionStatus: "canceling",
        cancelRequestedAt: new Date(),
      },
      { merge: true }
    );

    console.log(`[Subscription Cancellation] User ${user.id} (${user.email}) requested cancellation.`);

    return NextResponse.json({
      success: true,
      message: "Subscription cancellation requested. No further charges will occur.",
    });
  } catch (error: any) {
    console.error("Error processing subscription cancellation:", error);
    return NextResponse.json({ error: "Failed to process cancellation." }, { status: 500 });
  }
}
