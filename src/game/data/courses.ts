/**
 * MVP Course definitions.
 *
 * Requirements:
 * - 3 main courses
 * - exactly 8 lessons each (one per week)
 * - lesson content is block-based and fully data-driven
 */

import type { Course } from "../types/course";

export const aiFoundationsCourse: Course = {
  id: "ai-foundations",
  title: "AI Foundations",
  description: "Learn what AI is, how it learns, and why it matters.",
  lessons: [
    {
      id: "lesson-aif-01",
      courseId: "ai-foundations",
      week: 1,
      title: "AI, ML, and Learning from Data",
      concept: "Vocabulary + mental model",
      summary:
        "AI can feel mysterious because people use the term for everything. This lesson separates AI, machine learning, and deep learning with concrete examples, then introduces the core idea you’ll reuse all semester: models learn patterns from data to make predictions, and they’re only as good as their training and evaluation.",
      contentBlocks: [
        {
          type: "text",
          text:
            "AI is a broad category. Machine learning (ML) is a common way to build AI by learning patterns from examples. Deep learning is a family of ML techniques that often use neural networks. In this course, you’ll focus on the workflow: define a task, gather data, train a model, evaluate it, and iterate.",
        },
        {
          type: "video",
          title: "YouTube embed test (safe)",
          url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        },
        {
          type: "example",
          title: "Pattern learning",
          text:
            "Spam filter: inputs are emails, output is ‘spam’ or ‘not spam’. The model learns patterns from labeled examples and predicts the label for new emails.",
        },
        {
          type: "tip",
          text:
            "When you feel lost, write down: input → model → output. It’s the fastest way to de-mystify an AI feature.",
        },
      ],
      quiz: { status: "placeholder", note: "Quiz content will be added later." },
      studyExtension: { status: "placeholder", note: "Study extension will be added later." },
      effects: { status: "placeholder", note: "Lesson effects will be added later." },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-02",
      courseId: "ai-foundations",
      week: 2,
      title: "Datasets, Labels, and Supervised Learning",
      concept: "Training from labeled examples",
      summary:
        "You’ll learn the supervised learning workflow: define a task, collect examples, label them, train a model to predict labels for new inputs, and test it. We’ll focus on what labels mean, why they’re expensive, and how the same pattern powers spam filters, image classification, and simple forecasting.",
      contentBlocks: [
        {
          type: "text",
          text:
            "Supervised learning means you have inputs and the ‘right answers’ (labels). The model learns a mapping from inputs to labels. Your job is often more about defining labels and collecting good examples than about the model itself.",
        },
        {
          type: "tip",
          text:
            "If you can’t clearly define labels, the ML project probably isn’t ready yet.",
        },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-03",
      courseId: "ai-foundations",
      week: 3,
      title: "Overfitting, Generalization, and Why Accuracy Lies",
      concept: "Testing on unseen data",
      summary:
        "A model can look great on training data and still fail in the real world. This lesson builds intuition for overfitting and generalization, explains train/validation/test splits, and shows why choosing the right metric matters more than chasing a single accuracy score.",
      contentBlocks: [
        {
          type: "text",
          text:
            "If you evaluate a model on the same data it learned from, you’re mostly measuring memory, not usefulness. Generalization means it performs well on new data that looks similar to real usage.",
        },
        {
          type: "example",
          title: "Overfitting feel",
          text:
            "A student who memorizes practice questions might ace the practice set but fail a new exam. Models can do the same without good evaluation.",
        },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-04",
      courseId: "ai-foundations",
      week: 4,
      title: "Features and Problem Framing",
      concept: "Classification vs regression",
      summary:
        "Many AI failures start with a vague problem definition. You’ll practice framing a problem the way an ML system needs: inputs, outputs, and success criteria. You’ll compare classification and regression and learn how ‘features’ are just useful signals extracted from raw input.",
      contentBlocks: [
        {
          type: "text",
          text:
            "A good frame answers: what data goes in, what prediction comes out, and what you’ll measure. ‘Make the app smarter’ is not a frame; ‘predict whether a user will churn this week’ is.",
        },
        { type: "tip", text: "Write the output first. If you can’t, you don’t have a model target." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-05",
      courseId: "ai-foundations",
      week: 5,
      title: "Neural Networks Without the Mystery",
      concept: "Layers and representations",
      summary:
        "Neural networks can be understood without heavy math: layers of simple computations that learn useful representations. You’ll learn what changes during training, why depth helps, and how neural nets fit into the same ML workflow you already know.",
      contentBlocks: [
        {
          type: "text",
          text:
            "A neural network is a function with many adjustable parameters (weights). Training is adjusting weights so outputs match labels on examples. Deeper networks can learn more complex patterns by stacking transformations.",
        },
        { type: "tip", text: "If you understand ‘optimize weights to reduce error’, you understand training." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-06",
      courseId: "ai-foundations",
      week: 6,
      title: "Language Models, Tokens, and Embeddings",
      concept: "LLM intuition",
      summary:
        "This lesson explains modern language AI as an extension of ML: tokenize text, predict the next token, and represent meaning with embeddings. You’ll connect LLM behavior back to data, training, evaluation, and limitations so it feels understandable rather than magical.",
      contentBlocks: [
        {
          type: "text",
          text:
            "Tokens are pieces of text the model operates on. Embeddings are numeric vectors that capture relationships between words and concepts. LLMs generate by predicting what token should come next given context.",
        },
        { type: "tip", text: "When outputs drift, improve the context: clearer instructions + better examples." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-07",
      courseId: "ai-foundations",
      week: 7,
      title: "Responsible AI Basics",
      concept: "Bias, privacy, safety",
      summary:
        "AI systems can cause harm even when no one intends it. You’ll learn common risks (bias, privacy leaks, misleading confidence) and practical mitigations like dataset checks, human review, and UX guardrails so systems fail safely.",
      contentBlocks: [
        {
          type: "text",
          text:
            "Responsible AI isn’t only policy—it’s design. You can reduce harm by constraining inputs, validating outputs, logging errors safely, and offering non-AI fallbacks when confidence is low.",
        },
        { type: "tip", text: "Design the ‘what if it’s wrong?’ path early. Don’t bolt it on later." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-aif-08",
      courseId: "ai-foundations",
      week: 8,
      title: "Choosing the Right AI Approach",
      concept: "Rules vs ML vs LLMs",
      summary:
        "Put the foundations together into a decision process: when to use rules, classic ML, or LLMs, what data you’d need, what tradeoffs you’ll accept, and how you’ll measure success. You’ll leave with a simple checklist for any ‘should we use AI?’ conversation.",
      contentBlocks: [
        {
          type: "text",
          text:
            "Start with user value and constraints. If correctness must be perfect, prefer rules and verification. If you have labeled data, classic ML might fit. If language and flexible reasoning are needed, consider an LLM—with guardrails and evaluation.",
        },
        { type: "tip", text: "The best model choice is the one you can evaluate and support." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
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
      courseId: "data-prompting-basics",
      week: 1,
      title: "How LLMs Respond: Context In, Completion Out",
      concept: "Mental model for chat AI",
      summary:
        "Chat-based AI works by predicting text based on the conversation context. You’ll learn why small prompt changes cause big output changes, how ambiguity in instructions produces ambiguity in answers, and how to think about prompts as inputs that shape a probabilistic system.",
      contentBlocks: [
        {
          type: "text",
          text:
            "A chat model doesn’t ‘think’ the way you do—it continues text based on patterns. Your prompt is the main control surface: instructions, examples, and constraints all become part of the context the model uses to generate.",
        },
        {
          type: "video",
          title: "YouTube embed test (safe)",
          url: "https://youtu.be/M7lc1UVf-VE",
        },
        {
          type: "example",
          title: "Ambiguity",
          text:
            "Prompt: ‘Summarize this’ produces different outputs depending on whether you specify audience, length, and format (bullets vs paragraph).",
        },
        {
          type: "tip",
          text:
            "If you care about output shape, specify the format explicitly (JSON/table/bullets).",
        },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-02",
      courseId: "data-prompting-basics",
      week: 2,
      title: "Prompt Structure: Goal, Constraints, and Format",
      concept: "Prompt template basics",
      summary:
        "Practice writing prompts that reliably get you what you want by separating the goal (what), constraints (rules), and output format (shape). You’ll learn patterns like role + task + context + format, and why specifying the format is often the biggest quality lever.",
      contentBlocks: [
        {
          type: "text",
          text:
            "A reliable prompt is specific about the goal, constraints, and the output format. In software, the output format matters because your UI and logic depend on it.",
        },
        {
          type: "example",
          title: "Good vs. bad",
          text:
            "Bad: ‘Make flashcards.’ Better: ‘Create 10 flashcards as JSON {question, answer}, based only on the notes below.’",
        },
        { type: "tip", text: "If you want JSON, say JSON first—and include a tiny schema." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-03",
      courseId: "data-prompting-basics",
      week: 3,
      title: "Few-Shot Prompting: Teaching by Example",
      concept: "Steering with examples",
      summary:
        "Learn how to provide a small set of examples to steer the model’s behavior, tone, and formatting. You’ll practice choosing examples that cover edge cases, and you’ll see how one good example can outperform a long paragraph of instructions.",
      contentBlocks: [
        {
          type: "text",
          text:
            "Few-shot prompting means giving 1–3 examples of input→output so the model copies the pattern. Good examples are diverse and include tricky cases.",
        },
        { type: "tip", text: "Use examples to lock format; use instructions to lock rules." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-04",
      courseId: "data-prompting-basics",
      week: 4,
      title: "Structured Outputs: JSON, Tables, and Validations",
      concept: "Machine-usable outputs",
      summary:
        "Move from ‘nice sounding text’ to machine-usable outputs by requesting JSON or tables. You’ll learn how to specify schemas, how to handle partial/invalid outputs safely, and why structured output is essential when you want AI inside a real product.",
      contentBlocks: [
        { type: "text", text: "Structured output lets your UI stay stable even if wording changes. Treat AI output like external input: validate and recover safely." },
        { type: "tip", text: "Always plan a fallback: empty list, cached output, or ‘continue without AI’." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-05",
      courseId: "data-prompting-basics",
      week: 5,
      title: "Grounding with Notes: Don’t Make It Up",
      concept: "Retrieval + hallucinations",
      summary:
        "Learn the basic idea of grounding: provide trusted source text (your notes, a document excerpt) so the model can answer using that context. You’ll discuss hallucinations, why they happen, and how grounding plus clear constraints can reduce errors.",
      contentBlocks: [
        { type: "text", text: "When the model lacks information, it may still produce fluent text. Grounding reduces this by giving it the right context and limiting what it should use." },
        { type: "tip", text: "Ask for answers ‘based only on the provided notes’ and include short excerpts, not huge dumps." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-06",
      courseId: "data-prompting-basics",
      week: 6,
      title: "Iteration and Evaluation: Debug Prompts Like Code",
      concept: "Prompt testing loop",
      summary:
        "Treat prompting as an engineering loop: write a prompt, test it on multiple inputs, observe failure modes, and revise. You’ll learn simple evaluation habits—like keeping a small test set—so you can improve quality without guessing.",
      contentBlocks: [
        { type: "text", text: "Prompts should be tested against multiple inputs, not just one success case. Track failures and fix them deliberately." },
        { type: "tip", text: "Keep a tiny test set (3–5 inputs) and run it every time you change the prompt." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-07",
      courseId: "data-prompting-basics",
      week: 7,
      title: "Data Thinking for Prompts: Cleaning and Chunking",
      concept: "Prep text for reliability",
      summary:
        "Learn why the way you prepare text matters: removing noise, chunking long content, and adding light structure (headings, bullets, tags). You’ll see how small data-prep steps can make prompts shorter, outputs more accurate, and systems cheaper to run.",
      contentBlocks: [
        { type: "text", text: "Many prompt failures are data failures: messy input leads to messy output. Cleaning and chunking reduce confusion and cost." },
        { type: "tip", text: "Use headings and bullets in your notes. Structure is free quality." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-dpb-08",
      courseId: "data-prompting-basics",
      week: 8,
      title: "Reliable Prompt Pipelines: From Prompt to Workflow",
      concept: "Validate, retry, fallback",
      summary:
        "Combine everything into a mini pipeline: ingest input, normalize it, apply a prompt template, validate structured output, and retry safely when needed. You’ll focus on building workflows that degrade gracefully, so a single bad response doesn’t break the user experience.",
      contentBlocks: [
        { type: "text", text: "Think in steps: normalize → prompt → validate → retry/fallback. Your system should never be ‘one call and pray’." },
        { type: "tip", text: "If validation fails, show partial results and let the user continue." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-techstack", "feature-features"],
  },
};

export const systemsThinkingCourse: Course = {
  id: "systems-thinking-ai",
  title: "Systems Thinking for AI",
  description: "Learn to reason about AI systems end-to-end: goals, data, tradeoffs, and failure modes.",
  lessons: [
    {
      id: "lesson-stai-01",
      courseId: "systems-thinking-ai",
      week: 1,
      title: "Map the System: Inputs, Components, Outputs, Feedback",
      concept: "System map basics",
      summary:
        "Learn to draw a system map for an AI feature: where data comes from, what components transform it, and how outputs change future behavior. You’ll practice spotting feedback loops and hidden dependencies so you can design for stability rather than surprises.",
      contentBlocks: [
        {
          type: "text",
          text:
            "Systems thinking starts with a map. Identify inputs (user text, data), components (UI, logic, model call), outputs (text, actions), and feedback (how outputs change future inputs).",
        },
        {
          type: "video",
          title: "YouTube embed test (safe)",
          url: "https://www.youtube.com/watch?v=M7lc1UVf-VE&t=10s",
        },
        {
          type: "example",
          title: "Feedback loop",
          text:
            "If an AI tutor gives vague answers, users ask vague questions next—making answers worse. A better UI can break the loop by asking clarifying questions.",
        },
        {
          type: "tip",
          text:
            "When debugging, draw the system map first. It reveals the real bottleneck fast.",
        },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-02",
      courseId: "systems-thinking-ai",
      week: 2,
      title: "Data Pipelines: Collection, Storage, Access",
      concept: "Batch vs streaming",
      summary:
        "Explore how real systems move data: instrumentation, logs, databases, and batch vs. streaming pipelines. You’ll learn the difference between ‘data for the product’ and ‘data for learning,’ and how access patterns affect latency, cost, and reliability.",
      contentBlocks: [
        { type: "text", text: "Pipelines move data from events to storage to queries. Design depends on latency needs: batch for daily reports, streaming for near-real-time behavior." },
        { type: "tip", text: "Log just enough to debug—avoid collecting sensitive data by default." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-03",
      courseId: "systems-thinking-ai",
      week: 3,
      title: "Interfaces and Contracts: APIs and Schemas",
      concept: "Versioning and stability",
      summary:
        "Learn why clean interfaces matter: an AI feature usually spans UI, services, and model calls. You’ll practice defining request/response shapes, handling versioning, and using contracts so components can evolve without breaking each other.",
      contentBlocks: [
        { type: "text", text: "Contracts are how teams move fast without breaking things. Define schemas, validate inputs, and version changes intentionally." },
        { type: "tip", text: "Treat AI outputs like external API responses—validate before you trust." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-04",
      courseId: "systems-thinking-ai",
      week: 4,
      title: "Performance Tradeoffs: Latency, Cost, Timeouts",
      concept: "Caching and responsiveness",
      summary:
        "Understand practical constraints of AI calls in products: they can be slow or expensive. You’ll learn when to cache, when to batch, how to set timeouts, and how to design UI that stays responsive even when the AI is delayed.",
      contentBlocks: [
        { type: "text", text: "Users experience latency, not models. Use timeouts, loading states, and caching to keep interactions snappy." },
        { type: "tip", text: "Add timeouts early. A stuck UI is worse than a missing AI answer." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-05",
      courseId: "systems-thinking-ai",
      week: 5,
      title: "Observability: Logs, Metrics, Debugging",
      concept: "Make issues measurable",
      summary:
        "Learn what you need to measure to keep an AI system healthy: request volume, latency, error rates, and quality signals. You’ll discuss what to log safely, how to reproduce failures, and how to turn ‘the AI is bad’ into actionable debugging steps.",
      contentBlocks: [
        { type: "text", text: "Observability turns feelings into facts. Track latency, error rate, and basic quality signals so you can diagnose problems quickly." },
        { type: "tip", text: "Always include a correlation ID so you can trace a single request end-to-end." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-06",
      courseId: "systems-thinking-ai",
      week: 6,
      title: "Guardrails: Safety Filters and UX Constraints",
      concept: "Prevent risky outcomes",
      summary:
        "Learn guardrails as a system design problem, not just a model problem. You’ll explore input constraints, output filtering, and user-visible disclaimers, and you’ll see how to design flows that prevent risky actions instead of only reacting afterward.",
      contentBlocks: [
        { type: "text", text: "Guardrails include constraints, validation, and UX design. The goal is to reduce risk before the model produces harmful or unusable outputs." },
        { type: "tip", text: "Make the safe path the default path." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-07",
      courseId: "systems-thinking-ai",
      week: 7,
      title: "Failure Modes: Retries and Graceful Degradation",
      concept: "Fallback-first design",
      summary:
        "Practice designing for failure: invalid inputs, empty context, model errors, and blocked embeds. You’ll learn patterns like retry-with-backoff, cached defaults, and ‘continue without AI,’ so the system remains usable even when AI components fail.",
      contentBlocks: [
        { type: "text", text: "Assume dependencies fail. Your UX should still work without the AI component—maybe with partial output, cached content, or a manual path." },
        { type: "example", title: "Fallback", text: "If video embeds are blocked, show ‘Video unavailable’ and continue with text blocks—no crashes, no blocked progression." },
        { type: "tip", text: "Design the non-AI path first; then enhance with AI." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
    {
      id: "lesson-stai-08",
      courseId: "systems-thinking-ai",
      week: 8,
      title: "Ship It: Architecture Docs and Roadmaps",
      concept: "Milestones and delivery",
      summary:
        "Pull systems thinking into a shippable plan: write a short architecture overview, define milestones, and identify the highest-risk parts to test early. You’ll leave with a roadmap mindset that keeps AI projects grounded in constraints, user value, and iterative delivery.",
      contentBlocks: [
        { type: "text", text: "Shipping means aligning the system, the UX, and the constraints. Define milestones, document decisions, and test the riskiest assumptions early." },
        { type: "tip", text: "If you can’t explain the system in one page, it’s probably too complex for an MVP." },
      ],
      quiz: { status: "placeholder" },
      studyExtension: { status: "placeholder" },
      effects: { status: "placeholder" },
      interactionType: "read",
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
