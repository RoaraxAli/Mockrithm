import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { trackSession } from "@/lib/actions/session.action";

import SessionTracker from "@/components/SessionTracker";

import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews = [], allInterview = []] = await Promise.all([
    getInterviewsByUserId(user?.id ?? ""),
    getLatestInterviews({ userId: user?.id ?? "" }),
  ]);

  const hasPastInterviews = Array.isArray(userInterviews) && userInterviews.length > 0;
  const hasUpcomingInterviews = Array.isArray(allInterview) && allInterview.length > 0;

  return (
    <>
      <SessionTracker userId={user?.id || null} />
      <section className="card-cta">
        <div className="flex flex-col gap-5 max-w-xl z-10">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-300 tracking-tight">
            Get Interview-Ready with AI-Powered Practice
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-md font-medium">
            Engage in face-to-face AI mock interview simulations and get detailed analytical reports on filler words, pacing, and response logic.
          </p>

          <Button asChild className="btn-primary max-sm:w-full mt-2">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={360}
          height={360}
          className="max-md:hidden object-contain z-10 drop-shadow-[0_0_35px_rgba(124,58,237,0.15)] animate-pulse"
          style={{ animationDuration: '4s' }}
        />
      </section>

      <section className="flex flex-col gap-6 mt-14">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight text-white">Your Historical Interviews</h2>
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="col-span-full py-12 px-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col items-center text-center">
              <p className="text-gray-400 text-sm font-medium">You haven&apos;t taken any mock interviews yet.</p>
              <Link href="/interview" className="text-violet-400 text-xs mt-2 hover:underline font-bold">Start your first one now &rarr;</Link>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-14">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight text-white">Available Practice Roles</h2>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="col-span-full py-12 px-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col items-center text-center">
              <p className="text-gray-400 text-sm font-medium">There are no curated practice sessions available at this moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
