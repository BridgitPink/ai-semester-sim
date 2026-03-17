/**
 * MVP Course definitions with real beginner-friendly AI lesson content.
 * 3 courses × 3 lessons = 9 lessons total for the semester.
 */

import type { Course } from "../types/course";

export const aiFoundationsCourse: Course = {
  id: "ai-foundations",
  title: "AI Foundations",
  description: "Learn what AI is, how it learns, and why it matters.",
  lessons: [
    {
      id: "lesson-aif-01",
      title: "What is Artificial Intelligence?",
      concept: "AI Definition & History",
      interactionType: "read",
      shortPrompt: `Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These include learning from examples, recognizing patterns, understanding language, and making decisions. AI isn't magic—it's math applied at scale. From early rule-based systems to modern machine learning, AI has evolved from toys in labs to tools in your pocket. Understanding AI starts with understanding that machines can learn from data rather than being explicitly programmed for every scenario.`,
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-02",
      title: "How Do Machines Learn?",
      concept: "Machine Learning Basics",
      interactionType: "read",
      shortPrompt: `Machine learning is how AI systems improve without being directly reprogrammed. A system is trained on examples (data), it finds patterns in those examples, and then it can apply those patterns to new, unseen data. Imagine teaching a child to recognize dogs: you show them many dogs, they notice common features, and later they can identify dogs they've never seen before. That's machine learning. The better your examples (training data) and the smarter your system (model), the better it learns. This is the engine behind most modern AI.`,
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-03",
      title: "AI Applications in the Real World",
      concept: "AI Use Cases",
      interactionType: "read",
      shortPrompt: `AI is already embedded in your daily life. Email spam filters use AI to learn what spam looks like. Your phone's keyboard predicts the next word. Recommendation systems on Netflix and Spotify learn what you enjoy. Autonomous vehicles use AI to recognize roads, pedestrians, and obstacles. Medical AI tools help doctors diagnose diseases. Customer service chatbots handle thousands of conversations. The common thread: data in, patterns learned, decisions made. Understanding these examples helps you see where AI adds real value versus where it's just hype.`,
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-readme", "feature-problem-statement"],
  },
};

export const dataAndPromptingCourse: Course = {
  id: "data-prompting-basics",
  title: "Data & Prompting Basics",
  description: "Master data fundamentals and learn to work with large language models.",
  lessons: [
    {
      id: "lesson-dpb-01",
      title: "Why Good Data Matters",
      concept: "Data Quality & Bias",
      interactionType: "read",
      shortPrompt: `AI systems learn from data, so bad data leads to bad AI. Garbage in, garbage out. If your training data is biased (e.g., skewed toward one group), your AI will inherit that bias. If it's small or unrepresentative, your AI won't generalize to the real world. Data quality matters more than model complexity. This is why companies spend fortunes cleaning and curating datasets. As an AI practitioner, your first job is always asking: Is my data representative? Is it clean? Do I have enough of it? Could it contain harmful biases?`,
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-02",
      title: "Prompting: Speaking to AI Models",
      concept: "Prompt Engineering",
      interactionType: "read",
      shortPrompt: `Modern AI systems like ChatGPT are large language models (LLMs)—they predict the next word based on patterns in billions of text examples. You don't program them; you prompt them. A prompt is instructions and context. "Write a poem about winter" is a prompt. "Write a professional email asking for a deadline extension" is better. Great prompts are specific, include examples, and explain what you actually want. This is prompt engineering: the skill of asking AI the right way. Small changes to phrasing yield big changes in output quality. It's half art, half science.`,
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-03",
      title: "From Data to Insight",
      concept: "Data Analysis Fundamentals",
      interactionType: "read",
      shortPrompt: `Raw data is noise until you analyze it. Analysis means looking for patterns, trends, and anomalies. You might count how many users clicked a button, calculate the average rating, or spot an outlier. Simple analysis (like spreadsheet formulas) can answer many questions. More complex analysis uses statistical tests or machine learning models. The key skill: asking the right question of your data. "Are users who complete the tutorial more likely to stay active?" is a better question than "How many users logged in?" AI assists with analysis but doesn't replace critical thinking. Data literacy—understanding what data can and can't tell you—is a superpower.`,
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-techstack", "feature-features"],
  },
};

export const buildAiStudyHelperCourse: Course = {
  id: "build-ai-study-helper",
  title: "Build Your First AI Study Helper",
  description: "Bring it all together and create a beginner-friendly AI application.",
  lessons: [
    {
      id: "lesson-aish-01",
      title: "Defining Your AI Project",
      concept: "Project Scoping",
      interactionType: "read",
      shortPrompt: `Every AI project starts with a clear problem to solve. Your project: an AI Study Helper—a tool that takes study material and creates flashcards or quizzes. Narrow scope is a feature, not a bug. You're not building Duolingo; you're building one focused feature. Ask yourself: What is the user's pain point? What data do you need? How will you measure success? For your study helper: users get stuck on exam prep, they need fast practice materials, success = users report easier retention. Start with a one-sentence mission: "Help students generate study materials from textbooks using AI." Everything flows from that clarity.`,
      completionReward: { knowledge: 15, confidence: 15 },
    },
    {
      id: "lesson-aish-02",
      title: "Building with AI APIs",
      concept: "API Integration",
      interactionType: "read",
      shortPrompt: `You don't need to train your own AI model for your first project. APIs (Application Programming Interfaces) let you use powerful AI models built by others. OpenAI's API, Anthropic's API, Hugging Face—they all offer interfaces where you send text and get results. Your study helper could send "Here's my biology textbook chapter. Generate 10 flashcards" to an LLM API and get back formatted flashcards. This is accessible, cheap, and production-ready. The tradeoff: you depend on external services. The benefit: you ship fast and learn the fundamentals. Start here, optimize later.`,
      completionReward: { knowledge: 15, confidence: 15 },
    },
    {
      id: "lesson-aish-03",
      title: "Deploying Your Project",
      concept: "From Code to Users",
      interactionType: "read",
      shortPrompt: `Building is half the battle; shipping is the other half. Deployment means moving your code from your laptop to somewhere users can access it. For a web app: host on GitHub Pages, Vercel, or Heroku (many offer free tiers). For a backend service: consider AWS Lambda, Google Cloud Functions, or a simple Docker container. For your study helper: you could build a simple web interface (HTML + JavaScript), handle uploads, call the AI API, and display results. Free tier hosting gets you live fast. Don't aim for perfection; aim for "works, is public, gets feedback." You'll iterate. Launch with 80% and polish with users.`,
      completionReward: { knowledge: 15, confidence: 15 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-deployment", "feature-summary"],
  },
};

export const systemsThinkingCourse: Course = {
  id: "systems-thinking-ai",
  title: "Systems Thinking for AI",
  description: "Learn to reason about AI systems end-to-end: goals, data, tradeoffs, and failure modes.",
  lessons: [
    {
      id: "lesson-stai-01",
      title: "Thinking in Systems",
      concept: "Inputs → Process → Outputs (and feedback loops)",
      interactionType: "read",
      shortPrompt: `AI features don't live in isolation—they live inside systems. A system has inputs (data, prompts, user actions), a process (models, logic, policies), and outputs (text, decisions, UI changes). What makes systems hard is feedback: outputs change future inputs. If an AI tutor gives confusing answers, the user may ask worse questions next time. If a recommender shows extreme content, it can shift user behavior. Systems thinking means mapping the full loop, then designing guardrails: clear goals, good defaults, monitoring, and recovery plans when things go wrong. In this course, you'll practice seeing the whole pipeline, not just the model.` ,
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-bonus-architecture"],
  },
};

export const courses: Course[] = [
  aiFoundationsCourse,
  dataAndPromptingCourse,
  systemsThinkingCourse,
];
