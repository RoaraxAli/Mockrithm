import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

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

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  const serializedUser = serializeObject(user);
  const serializedInterview = serializeObject(interview);
  const serializedFeedback = serializeObject(feedback);

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{serializedInterview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={serializedInterview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {serializedInterview.type}
        </p>
      </div>

      <Agent
        userName={serializedUser?.name!}
        userId={serializedUser?.id}
        interviewId={id}
        type="interview"
        questions={serializedInterview.questions}
        feedbackId={serializedFeedback?.id}
        firstMessage={serializedInterview.firstMessage}
        codingProblem={serializedInterview.codingProblem}
        role={serializedInterview.role}
        sessionType={serializedInterview.type}
        userTier={serializedUser?.tier || "freemium"}
      />
    </>
  );
};

export default InterviewDetails;

