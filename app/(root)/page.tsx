import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import SessionTracker from "@/components/SessionTracker";
import LandingDashboard from "@/components/LandingDashboard";

// Helper to deep serialize custom classes like Firestore Timestamps to plain objects/strings
const serializeObject = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj.toDate === "function") {
    return obj.toDate().toISOString();
  }
  if (obj._seconds !== undefined && obj._nanoseconds !== undefined) {
    return new Date(obj._seconds * 1000).toISOString();
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeObject);
  }
  
  if (typeof obj === "object") {
    const plain: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        plain[key] = serializeObject(obj[key]);
      }
    }
    return plain;
  }
  
  return obj;
};

export default async function Home() {
  const user = await getCurrentUser();

  const [rawUserInterviews = [], rawAllInterviews = []] = await Promise.all([
    getInterviewsByUserId(user?.id ?? ""),
    getLatestInterviews({ userId: user?.id ?? "" }),
  ]);

  // Pre-fetch feedback for user's past interviews in parallel on the server
  const userInterviewsWithFeedback = await Promise.all(
    (rawUserInterviews || []).map(async (interview) => {
      const feedback = user?.id
        ? await getFeedbackByInterviewId({ interviewId: interview.id, userId: user.id })
        : null;
      return { ...interview, feedback };
    })
  );

  // Pre-fetch feedback for all curated interviews in parallel on the server
  const allInterviewsWithFeedback = await Promise.all(
    (rawAllInterviews || []).map(async (interview) => {
      const feedback = user?.id
        ? await getFeedbackByInterviewId({ interviewId: interview.id, userId: user.id })
        : null;
      return { ...interview, feedback };
    })
  );

  const serializedUser = serializeObject(user);
  const userInterviews = serializeObject(userInterviewsWithFeedback) || [];
  const allInterviews = serializeObject(allInterviewsWithFeedback) || [];

  return (
    <>
      <SessionTracker userId={user?.id || null} />
      <LandingDashboard
        user={serializedUser}
        userInterviews={userInterviews}
        allInterviews={allInterviews}
      />
    </>
  );
}
