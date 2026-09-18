import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ maintenance: false });
    }
    const docRef = db.collection("settings").doc("maintenance");
    const doc = await docRef.get();
    if (doc.exists) {
      return NextResponse.json({ maintenance: doc.data()?.active || false });
    }
    return NextResponse.json({ maintenance: false });
  } catch (error: any) {
    console.error("Error in maintenance API:", error);
    return NextResponse.json({ maintenance: false });
  }
}
