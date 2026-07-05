/**
 * Utility to load prompt templates dynamically from environment variables.
 * To keep proprietary IP secure, all detailed system prompts are configured via 
 * environment variables on production/Vercel, leaving zero IP in the checked-in source code.
 */
export function loadPromptTemplate(fileName: string): string {
  const envMap: Record<string, string | undefined> = {
    "challenge_generator.txt": process.env.PROMPT_CHALLENGE_GENERATOR,
    "welcome_generator.txt": process.env.PROMPT_WELCOME_GENERATOR,
    "star_analyzer.txt": process.env.PROMPT_STAR_ANALYZER,
    "feedback_generator.txt": process.env.PROMPT_FEEDBACK_GENERATOR,
    "interview_persona.txt": process.env.PROMPT_INTERVIEW_PERSONA,
    "setup_persona.txt": process.env.PROMPT_SETUP_PERSONA,
  };

  const envValue = envMap[fileName];
  if (envValue && envValue.trim().length > 0) {
    // Replace literal '\n' characters with actual newlines in case they are formatted as single-line env strings
    return envValue.replace(/\\n/g, "\n");
  }

  // Generic minimal skeletons to protect commercial IP and prevent build failures
  const fallbacks: Record<string, string> = {
    "welcome_generator.txt": "You are Alex, an AI interviewer. Output a one-sentence greeting confirming that the {{role}} interview is starting. {{languageInstruction}}",

    "challenge_generator.txt": "Generate a coding challenge suitable for a {{level}}-level {{role}} focusing on {{techstack}}. Do not solve it. Return JSON matching: { title, description, templateCode, language }",

    "star_analyzer.txt": "Return JSON containing STAR analysis framework metrics for situation, task, action, and result.",

    "feedback_generator.txt": "Review the transcript and output a JSON grading report. Match schema: { totalScore: number, categoryScores: Array<{name, score, comment}>, strengths: string[], areasForImprovement: string[], finalAssessment: string }",

    "interview_persona.txt": "You are Alex, conducting a voice interview with a candidate. Role: {{role}}. Mode: {{sessionType}}. Ask the questions: {{formattedQuestions}}. CRITICAL: The candidate's screen has a built-in sandbox editor panel. You MUST output '[SHOW_SANDBOX]' (case-insensitive) as soon as you present the coding challenge or ask them to write code. Never solve the code, output code templates, or suggest external coding tools. Keep responses under 25 words. {{languageInstruction}} {{sandboxInfo}}",

    "setup_persona.txt": "You are a professional assistant. Help configure the mock session for {{userName}} for the default role {{profileRole}}. Ask questions, present custom options, and end with [END_CALL]. {{languageInstruction}}"
  };

  return fallbacks[fileName] || "";
}

/**
 * Interpolates variables in format {{variableName}} within prompt templates.
 */
export function compilePrompt(template: string, params: Record<string, string>): string {
  let compiled = template;
  for (const [key, val] of Object.entries(params)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    compiled = compiled.replace(regex, val);
  }
  return compiled;
}
