import LandingDashboard from "@/components/LandingDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLatestInterviews, getInterviewsByUserId, getFeedbacksForUser } from "@/lib/actions/general.action";

function serializeData(data: any): any {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) return data.toISOString();
  if (typeof data === "object") {
    if (typeof data.toDate === "function") {
      return data.toDate().toISOString();
    }
    if (typeof data._seconds === "number" && typeof data._nanoseconds === "number") {
      return new Date(data._seconds * 1000).toISOString();
    }
    const result: any = Array.isArray(data) ? [] : {};
    for (const key of Object.keys(data)) {
      result[key] = serializeData(data[key]);
    }
    return result;
  }
  return data;
}

export default async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id || null;

  // Fetch data in parallel on the server
  const [userInterviews, allInterviews, userFeedbacks] = await Promise.all([
    userId ? getInterviewsByUserId(userId) : Promise.resolve([]),
    getLatestInterviews({ userId: userId || "", limit: 20 }),
    userId ? getFeedbacksForUser(userId) : Promise.resolve([]),
  ]);

  // Map feedbacks to interviews
  const feedbackMap = new Map((userFeedbacks || []).map((f) => [f.interviewId, f]));
  const userInterviewsWithFeedback = (userInterviews || []).map((interview) => ({
    ...interview,
    feedback: feedbackMap.get(interview.id) || null,
  }));

  const allInterviewsWithFeedback = (allInterviews || []).map((interview) => ({
    ...interview,
    feedback: feedbackMap.get(interview.id) || null,
  }));

  return (
    <LandingDashboard
      user={serializeData(user)}
      userInterviews={serializeData(userInterviewsWithFeedback)}
      allInterviews={serializeData(allInterviewsWithFeedback)}
    />
  );
}

