import { GamesLandingPage } from "../page";
import { Metadata } from "next";

type TopicType = "html" | "css" | "js" | "ts" | "react" | "nextjs" | "node" | "git" | "sql" | "python";

interface TopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

const topicsInfo: Record<TopicType, { title: string; description: string; keywords: string }> = {
  html: {
    title: "Learn HTML5 Semantic Layouts - Mockrithm DevGames",
    description: "Practice semantic layout architecture, WAI-ARIA validation, and clean document flow on our interactive sandbox game terminal.",
    keywords: "html, html5, layouts, web development, sandbox compiler, mockrithm"
  },
  css: {
    title: "Learn CSS3 Grids & Animations - Mockrithm DevGames",
    description: "Design responsive grid elements and high-performance GPU animations on our live CSS compiler game sandbox.",
    keywords: "css, css3, grid, layout, anims, keyframes, transitions, compiler, sandbox"
  },
  js: {
    title: "Learn JavaScript Core Algorithms - Mockrithm DevGames",
    description: "Master event loops, closures, generators, and async microtask queues on our interactive JS playground.",
    keywords: "javascript, js, es6, es15, asynchronous, closures, event loop, algorithms, coding games"
  },
  ts: {
    title: "Learn TypeScript Strict Compilation - Mockrithm DevGames",
    description: "Secure type safety with generic mapping and strict tsconfig parameters in our interactive compiler terminal.",
    keywords: "typescript, ts, strictly typed, generics, interfaces, compiler sandbox"
  },
  react: {
    title: "Learn React Hooks & Render Optimization - Mockrithm DevGames",
    description: "Optimize virtual DOM cycles, prevent unnecessary rerenders, and master custom React hook structures.",
    keywords: "react, reactjs, state, hooks, virtual dom, render, optimization, sandbox"
  },
  nextjs: {
    title: "Learn Next.js App Router & Server Actions - Mockrithm DevGames",
    description: "Architect sub-second fullstack pipelines, server action validations, and server-side data models.",
    keywords: "nextjs, app router, server action, SSR, server component, validation sandbox"
  },
  node: {
    title: "Learn Node.js Stream Buffers & APIs - Mockrithm DevGames",
    description: "Build high-throughput backends, cluster clustering, and data pipe streams in our Node terminal environment.",
    keywords: "nodejs, node, backend, streams, buffers, clustering, APIs, coding games"
  },
  git: {
    title: "Learn Git Rebasing & Reflogs - Mockrithm DevGames",
    description: "Resolve tree branch conflicts, fix detached HEAD configurations, and restore commits using git reflog.",
    keywords: "git, rebasing, git interactive, commit, branch merging, reflog, merge conflict sandbox"
  },
  sql: {
    title: "Learn SQL Queries & Indexing - Mockrithm DevGames",
    description: "Solve partition metrics windows, rank statements, and analyze database query plans interactively.",
    keywords: "sql, window functions, query optimizer, indexing, database sandbox"
  },
  python: {
    title: "Learn Python Generators & FastAPIs - Mockrithm DevGames",
    description: "Leverage generator context managers, async ASGI servers, and pydantic typing interactively.",
    keywords: "python, generator, decorator, fastapi, asgi, coding sandbox"
  }
};

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const lowercaseTopic = topic.toLowerCase() as TopicType;
  const topicData = topicsInfo[lowercaseTopic] || topicsInfo.html;

  return {
    title: topicData.title,
    description: topicData.description,
    keywords: topicData.keywords,
    openGraph: {
      title: topicData.title,
      description: topicData.description,
      type: "website",
      url: `https://games.mockrithm.me/${lowercaseTopic}`,
      images: [
        {
          url: "https://mockrithm.me/logo.svg",
          width: 800,
          height: 800,
          alt: "Mockrithm Logo"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: topicData.title,
      description: topicData.description
    }
  };
}

export async function generateStaticParams() {
  return [
    { topic: "html" },
    { topic: "css" },
    { topic: "js" },
    { topic: "ts" },
    { topic: "react" },
    { topic: "nextjs" },
    { topic: "node" },
    { topic: "git" },
    { topic: "sql" },
    { topic: "python" }
  ];
}

export default async function TopicLandingPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const matchedTopic = (topic.toLowerCase() in topicsInfo ? topic.toLowerCase() : "html") as TopicType;

  return <GamesLandingPage initialTopic={matchedTopic} />;
}
