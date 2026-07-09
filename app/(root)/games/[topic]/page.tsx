import { GamesLandingPage } from "../page";
import { Metadata } from "next";

type TopicType = "html" | "css" | "js" | "sql" | "api" | "dsa" | "audio" | "star" | "logic" | "react" | "python" | "devops" | "metrics" | "system" | "security";

interface TopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

const topicsInfo: Record<TopicType, { title: string; description: string; keywords: string }> = {
  html: {
    title: "Learn HTML Structure & Semantics - Mockrithm DevGames",
    description: "Build clean, accessible DOM pipelines, check semantic layout nodes, and structure HTML trees under compiler constraints.",
    keywords: "html, html5, semantics, web development, markup sandbox, mockrithm"
  },
  css: {
    title: "Learn CSS Flexbox & Grid Master - Mockrithm DevGames",
    description: "Architect fluid layouts and multi-dimensional responsive grids under execution time limits in our live CSS sandbox.",
    keywords: "css, flexbox, grid, visual layout, responsive web design, keyframe compiler"
  },
  js: {
    title: "Learn JavaScript Event Loop Challenge - Mockrithm DevGames",
    description: "Trace async call queues, microtask promises, call stack variations, and event emitter sequences interactively.",
    keywords: "javascript, js, event loop, async, promise, microtask, closure sandbox"
  },
  sql: {
    title: "Learn SQL Query Master - Mockrithm DevGames",
    description: "Optimize execution trees with window partition rankings, composite database indexes, and EXPLAIN ANALYZE checks.",
    keywords: "sql, query optimization, database index, window functions, analytics query sandbox"
  },
  api: {
    title: "Learn API Route Architect - Mockrithm DevGames",
    description: "Design robust REST and GraphQL routes, check schemas with Zod, and configure secure API servers interactively.",
    keywords: "api design, rest api, graphql, zod validation, express backend sandbox"
  },
  dsa: {
    title: "Learn Data Structures Blitz - Mockrithm DevGames",
    description: "Solve binary search tree depth traversals, singly/doubly linked list pointer variations, and Big O space complexity games.",
    keywords: "dsa, algorithms, linked lists, trees, binary search, big o notation compiler"
  },
  audio: {
    title: "Learn Behavioral Audio Analyzer - Mockrithm DevGames",
    description: "Isolate tone frequencies, speech rate deviations, and speech filler occurrences in our real-time voice assessment compiler.",
    keywords: "audio analyzer, voice assessment, pitch analysis, filler words, speech simulator"
  },
  star: {
    title: "Learn STAR Method Speed Run - Mockrithm DevGames",
    description: "Synthesize behavioral answer components: Situation, Task, Action, and Result indicators quickly under validation check metrics.",
    keywords: "star framework, behavioral interview, behavioral simulator, action result metrics"
  },
  logic: {
    title: "Learn Logic & Aptitude Sprint - Mockrithm DevGames",
    description: "Isolate pattern logic sequences, cognitive aptitude matrices, and boolean algebra structures interactively.",
    keywords: "logic sprint, aptitude test, cognitive puzzles, pattern recognition sandbox"
  },
  react: {
    title: "Learn React State Racer - Mockrithm DevGames",
    description: "Prevent unnecessary virtual DOM redraw cycles, optimize custom state hooks, and compile memoized lists.",
    keywords: "react state, custom hooks, useCallback, useMemo, rendering optimization sandbox"
  },
  python: {
    title: "Learn Python Scripting Sprint - Mockrithm DevGames",
    description: "Author yield generator loops, asynchronous async stream pipelines, and validate pydantic schemas under compiler constraints.",
    keywords: "python, generator loop, async validation, fastapi uvicorn, scripting compiler"
  },
  devops: {
    title: "Learn DevOps Pipeline Fixer - Mockrithm DevGames",
    description: "Identify syntax gaps in YAML workflow scripts, optimize multi-stage Docker build files, and manage environment secrets.",
    keywords: "devops, CI/CD pipeline, github actions, docker image, yaml configuration sandbox"
  },
  metrics: {
    title: "Learn Product Metrics Tycoon - Mockrithm DevGames",
    description: "Isolate marketing conversion steps, set up statistical A/B test variations, and evaluate retention scores.",
    keywords: "product metrics, ab testing, user retention, growth marketing sandbox"
  },
  system: {
    title: "Learn System Design Architect - Mockrithm DevGames",
    description: "Design horizontal sharding systems, configure Redis caching strategies, and implement low-latency load balancers.",
    keywords: "system design, load balancing, horizontal sharding, redis cache, scalability sandbox"
  },
  security: {
    title: "Learn Cybersecurity Threat Hunter - Mockrithm DevGames",
    description: "Isolate injection exploits, sanitize parameter variables, and protect applications from cross-site scripting vulnerabilities.",
    keywords: "cybersecurity, threat hunting, sql injection, xss protection, input sanitizer sandbox"
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
    { topic: "sql" },
    { topic: "api" },
    { topic: "dsa" },
    { topic: "audio" },
    { topic: "star" },
    { topic: "logic" },
    { topic: "react" },
    { topic: "python" },
    { topic: "devops" },
    { topic: "metrics" },
    { topic: "system" },
    { topic: "security" }
  ];
}

export default async function TopicLandingPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const matchedTopic = (topic.toLowerCase() in topicsInfo ? topic.toLowerCase() : "html") as TopicType;

  return <GamesLandingPage initialTopic={matchedTopic} />;
}
