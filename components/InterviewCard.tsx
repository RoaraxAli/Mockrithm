import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="w-[360px] max-sm:w-full min-h-96 relative flex items-stretch">
      <div className="card-interview flex-1">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider text-white",
              badgeColor
            )}
          >
            {normalizedType}
          </div>

          {/* Cover Image */}
          <div className="relative w-fit">
            <div className="absolute inset-0 bg-violet-500 rounded-full blur opacity-15" />
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={80}
              height={80}
              className="rounded-full object-cover size-[80px] border border-white/10 relative"
            />
          </div>

          {/* Interview Role */}
          <h3 className="mt-5 capitalize text-lg font-bold text-white tracking-wide">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-3 mt-4 items-center flex-wrap">
            <div className="flex flex-row gap-1.5 items-center bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full">
              <Image
                src="/calendar.svg"
                width={14}
                height={14}
                alt="calendar"
              />
              <p className="text-xs text-gray-300 font-semibold">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-1.5 items-center bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full">
              <Image src="/star.svg" width={14} height={14} alt="star" />
              <p className="text-xs text-gray-300 font-semibold">{feedback?.totalScore ? `${feedback.totalScore}/100` : "---/100"}</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5 text-xs text-gray-400 font-medium leading-relaxed">
            {feedback?.finalAssessment ||
              "You haven't taken this mock interview yet. Challenge yourself now to practice."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-6 pt-4 border-t border-white/5">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary text-xs" asChild>
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Review Analytics" : "Start Session"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
