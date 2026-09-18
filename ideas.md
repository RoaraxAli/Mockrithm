# Gamified Learning Citadel: Core Architecture & Future Roadmap

This document outlines the detailed system design, logic engines, and creative roadmap features implemented inside the **Mockrithm Mastery Citadel** gamified platform.

---

## 1. Gamified Architecture

### Global Campaign Quests Portal
A dashboard system that tracks user stats across multiple technologies to calculate and reward complex achievements.
*   **Genesis Sandbox**: Tracks initial user activation (clearing Level 1 on any game) -> `+50 XP`.
*   **Polyglot Apprentice**: Encourages learning multiple tech stacks. Awarded when reaching Level 5 on 3 distinct languages -> `+150 XP`.
*   **Frontend Sorcerer**: Awarded when completing core layout stacks (HTML5, CSS3, Tailwind CSS) to Level 10 -> `+250 XP`.
*   **Fullstack Alchemist**: Awarded when completing core scripting stacks (JavaScript and ReactJS) to Level 10 -> `+200 XP`.
*   **DevOps Helmsman**: Awarded when completing deployment stacks (Git and Docker) to Level 5 -> `+150 XP`.
*   **Security Sentinel**: Awarded when completing defensive stacks (Cyber Security) to Level 5 -> `+150 XP`.

### Local Arena Ranks & Badges
Within each language arena, progress is broken down into 5 progressive brackets. Badges dynamically scale, glow, and lock/unlock as users level up:
1.  **Apprentice** (Lv. 1 - 100): Bronze/Amber theme. Focused on basic syntax, variables, and primitive definitions.
2.  **Mage** (Lv. 101 - 200): Teal/Cyan theme. Focused on structure, operators, interfaces, and core API calls.
3.  **Knight** (Lv. 201 - 300): Golden theme. Focused on modular design, generics, and intermediate logic trees.
4.  **Warlord** (Lv. 301 - 400): Purple/Fuchsia theme. Focused on advanced integrations, middleware, and schemas.
5.  **Grandmaster** (Lv. 401 - 500): Red/Ruby theme. Focused on high-performance optimization, concurrency, and sandbox builds.

---

## 2. Interactive Sandboxed Compilers

The platform shifts away from simple multiple-choice quizzes to focus on hands-on code writing. It operates 4 distinct live compile modes:
*   **HTML/CSS/Tailwind Live Previews**: Renders source files inside a sandboxed, styled `iframe` on-the-fly, giving users instant visual feedback.
*   **SQL Relational Crawler Grid**: A interactive database grid. Writing queries filters actual visual table rows (e.g., executing `WHERE level > 10` instantly strips weaker items from the grid).
*   **Git Timeline terminal**: A mock console environment that accepts CLI instructions (`git init`, `git add`, `git commit`, `git status`, `git log`) and updates staged and committed branch states.
*   **Standard Script Evaluator**: Evaluates JavaScript, Python, TypeScript, and Django structures, mapping arguments to unit test assertions.

---

## 3. Dynamic Curriculum Engine

To keep content unique across 7,000 potential levels (14 games × 500 levels) without overloading bundle size, we use a **Procedural Curriculum Engine**:
*   **Topic Mapping**: Converts levels into 50 progressive sub-topics per language.
*   **Step Category Rotation (`stepIndex % 5`)**: Cycles the challenge type every level to keep learning engaging:
    *   *Step 1 & 6*: Variables & Assignments (e.g., declare variable with level-based names/values).
    *   *Step 2 & 7*: Functional calculations (e.g., arithmetic multiplication mapping).
    *   *Step 3 & 8*: Conditionals (e.g., limit checks and bounds validations).
    *   *Step 4 & 9*: Collections (e.g., list, array, or interface structure creation).
    *   *Step 5 & 10*: Advanced loops, list comprehensions, or system-specific configurations.
*   **Fail-by-Default Starters**: Starter templates are initialized with empty braces, void functions, or uninitialized commands so that users must write code to pass the automated tests.

---

## 4. Future Expansion Ideas

### 1. Multiplayer Duel Arena (Code Battles)
*   **1v1 Speed Match**: Match users in real-time to solve a progressive sequence of 5 coding levels. The fastest player to compile passing code wins the duel.
*   **Code Golf**: Compete to solve the mission using the fewest possible characters.

### 2. GitHub Sync Integration
*   **Sync Accomplishments**: Allow users to link their GitHub profile. Completing grandmaster challenges pushes a clean commit to a dedicated personal repository, building a visual portfolio of achievements.
*   **Custom VS Code Extension**: Allow users to solve Citadel missions directly inside VS Code, syncing workspace files back to the cloud.

### 3. Custom Level Creator (citadel.json)
*   **Citadel Marketplace**: Allow users to design and publish custom coding lessons.
*   **Automatic Validation**: Creators specify custom `testRegex` checks and starter templates in a simple `citadel.json` manifest. Other users can discover, play, and rate these community challenges.
