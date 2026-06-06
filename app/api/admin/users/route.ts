import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

const ADMIN_EMAILS = ["ahmed@gmail.com"];

export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdmin =
      user &&
      (user.role?.toLowerCase() === "admin" ||
        ADMIN_EMAILS.includes(user.email || ""));

    if (!user || !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const querySnapshot = await db.collection("users").get();
    const users = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      // Serialize Firestore Timestamps to ISO strings
      createdAt: doc.data().createdAt?.toDate
        ? doc.data().createdAt.toDate().toISOString()
        : doc.data().createdAt ?? null,
    }));
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
