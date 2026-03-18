import type { Course } from "../../types/course";

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
      gradedAssessment: {
        id: "stai-quiz-01",
        courseId: "systems-thinking-ai",
        lessonId: "lesson-stai-01",
        week: 1,
        type: "quiz",
        mode: "graded",
        title: "Quiz: Systems Thinking (Week 1)",
        description: "One attempt. Submitting completes the lesson.",
        weight: 40,
        passingScore: 70,
        questions: [
          {
            id: "q1",
            type: "mcq",
            prompt: "Which list best matches a simple system map for an AI feature?",
            options: [
              { id: "a", text: "Colors → fonts → icons → theme" },
              { id: "b", text: "Inputs → components → outputs → feedback" },
              { id: "c", text: "CPU → GPU → RAM → disk" },
              { id: "d", text: "Buttons → clicks → happiness" },
            ],
            correctIndex: 1,
            explanation: "That’s the core structure: what goes in, what transforms it, what comes out, and how it loops back.",
          },
          {
            id: "q2",
            type: "mcq",
            prompt: "What is a feedback loop in an AI system?",
            options: [
              { id: "a", text: "A UI animation after clicking a button" },
              { id: "b", text: "Outputs that change future inputs/behavior" },
              { id: "c", text: "A bug report system" },
              { id: "d", text: "A model always giving the same answer" },
            ],
            correctIndex: 1,
            explanation: "Feedback loops happen when outputs influence future user actions or data collection.",
          },
          {
            id: "q3",
            type: "mcq",
            prompt: "Why draw a system map before debugging?",
            options: [
              { id: "a", text: "It guarantees higher model accuracy" },
              { id: "b", text: "It can reveal the real bottleneck across UI, logic, data, and model" },
              { id: "c", text: "It replaces testing" },
              { id: "d", text: "It makes prompts shorter" },
            ],
            correctIndex: 1,
            explanation: "Many failures are system failures (data/UX/contracts), not just ‘model quality’.",
          },
        ],
      },
      studyExtension: {
        recapBlocks: [
          {
            type: "text",
            text:
              "Recap: map an AI feature as inputs → components → outputs, then look for feedback loops that amplify problems or drift.",
          },
        ],
        extraBlocks: [
          {
            type: "tip",
            text:
              "Extra: if a user can repeatedly nudge the system, you have a loop—even if you never retrain the model.",
          },
          {
            type: "example",
            title: "Loop breaker",
            text:
              "A clarifying question UI can stop vague inputs from compounding into vague outputs.",
          },
        ],
        practiceAssessment: {
          id: "stai-practice-01",
          courseId: "systems-thinking-ai",
          lessonId: "lesson-stai-01",
          week: 1,
          type: "quiz",
          mode: "practice",
          title: "Practice: Systems Thinking (Week 1)",
          description: "Practice only — does not affect your grade.",
          questions: [
            {
              id: "pq1",
              type: "mcq",
              prompt: "In a system map, what comes *after* components?",
              options: [
                { id: "a", text: "Outputs" },
                { id: "b", text: "Fonts" },
                { id: "c", text: "Bugs" },
                { id: "d", text: "Timezones" },
              ],
              correctIndex: 0,
              explanation: "Inputs → components → outputs → feedback is the basic chain.",
            },
            {
              id: "pq2",
              type: "mcq",
              prompt: "A feedback loop is most likely to cause…",
              options: [
                { id: "a", text: "Amplification over time (better or worse)" },
                { id: "b", text: "Guaranteed correctness" },
                { id: "c", text: "Zero latency" },
                { id: "d", text: "No user impact" },
              ],
              correctIndex: 0,
              explanation: "Loops can amplify drift, bias, or quality—so you want to spot them early.",
            },
          ],
        },
        bonuses: {
          knowledge: 2,
          focus: 2,
        },
      },
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
      workbenchHooks: {
        projectCategory: "interface",
      },
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
        {
          type: "text",
          text:
            "Pipelines move data from events to storage to queries. Design depends on latency needs: batch for daily reports, streaming for near-real-time behavior.",
        },
        {
          type: "video",
          title: "Batch vs. streaming (conceptual overview)",
          url: "https://www.youtube.com/watch?v=5b7p8o1m0JQ",
        },
        {
          type: "example",
          title: "Two pipelines, two goals",
          text:
            "Product analytics: batch a daily report of feature usage. AI improvement: stream error events so you can spot quality regressions quickly.",
        },
        {
          type: "tip",
          text:
            "Log just enough to debug—avoid collecting sensitive data by default.",
        },
      ],
      gradedAssessment: {
        id: "stai-checkpoint-02",
        courseId: "systems-thinking-ai",
        lessonId: "lesson-stai-02",
        week: 2,
        type: "checkpoint",
        mode: "graded",
        title: "Checkpoint: Systems Thinking (Week 2)",
        description: "Checkpoint test. One attempt.",
        weight: 60,
        passingScore: 70,
        questions: [
          {
            id: "cp1",
            type: "mcq",
            prompt: "Which statement best describes a data pipeline?",
            options: [
              { id: "a", text: "A UI component for charts" },
              { id: "b", text: "A flow that moves data from events to storage to queries/consumers" },
              { id: "c", text: "A model architecture" },
              { id: "d", text: "A list of prompts" },
            ],
            correctIndex: 1,
            explanation: "Pipelines are about movement + transformation of data across the system.",
          },
          {
            id: "cp2",
            type: "mcq",
            prompt: "When is batch processing usually a good fit?",
            options: [
              { id: "a", text: "Daily reports and non-urgent analytics" },
              { id: "b", text: "Instant safety monitoring that must alert in seconds" },
              { id: "c", text: "Real-time multiplayer input" },
              { id: "d", text: "Any time you need millisecond updates" },
            ],
            correctIndex: 0,
            explanation: "Batch is common for periodic summaries where latency isn’t critical.",
          },
          {
            id: "cp3",
            type: "mcq",
            prompt: "What’s a common reason to prefer streaming?",
            options: [
              { id: "a", text: "You want near-real-time signals for quality or errors" },
              { id: "b", text: "You never want to store anything" },
              { id: "c", text: "You want to avoid instrumentation" },
              { id: "d", text: "You want to remove validation" },
            ],
            correctIndex: 0,
            explanation: "Streaming is useful when you need fast detection of problems or changes.",
          },
          {
            id: "cp4",
            type: "mcq",
            prompt: "Which is an example of ‘data for learning’ rather than ‘data for the product’?",
            options: [
              { id: "a", text: "A user’s saved note text" },
              { id: "b", text: "A log of model failures with safe, minimal context" },
              { id: "c", text: "A button label" },
              { id: "d", text: "A CSS file" },
            ],
            correctIndex: 1,
            explanation: "Learning data often comes from logs/labels used to evaluate and improve systems.",
          },
          {
            id: "cp5",
            type: "mcq",
            prompt: "Which principle best supports reliability and privacy in pipeline logging?",
            options: [
              { id: "a", text: "Log everything by default" },
              { id: "b", text: "Log just enough to debug; avoid sensitive data by default" },
              { id: "c", text: "Never validate inputs" },
              { id: "d", text: "Only store screenshots" },
            ],
            correctIndex: 1,
            explanation: "Collecting minimal, relevant, non-sensitive telemetry reduces risk and noise.",
          },
        ],
      },
      studyExtension: {
        recapBlocks: [
          {
            type: "text",
            text:
              "Recap: pipelines move data from events → storage → consumers, and batch vs streaming is mainly a latency + cost decision.",
          },
        ],
        extraBlocks: [
          {
            type: "tip",
            text:
              "Extra: define who needs the data and how fast. ‘Later’ and ‘now’ usually require different architectures.",
          },
          {
            type: "example",
            title: "Latency tradeoff",
            text:
              "Quality alarms (streaming) can be expensive, but waiting for a nightly batch can hide a bad regression all day.",
          },
        ],
        practiceAssessment: {
          id: "stai-practice-02",
          courseId: "systems-thinking-ai",
          lessonId: "lesson-stai-02",
          week: 2,
          type: "checkpoint",
          mode: "practice",
          title: "Practice: Systems Thinking (Week 2)",
          description: "Practice only — does not affect your grade.",
          questions: [
            {
              id: "pq1",
              type: "mcq",
              prompt: "Streaming is most appropriate when you need…",
              options: [
                { id: "a", text: "Near-real-time signals" },
                { id: "b", text: "Monthly summaries" },
                { id: "c", text: "No instrumentation" },
                { id: "d", text: "A new model architecture" },
              ],
              correctIndex: 0,
              explanation: "Streaming is about low-latency detection and response.",
            },
            {
              id: "pq2",
              type: "mcq",
              prompt: "A safe default for logging is to…",
              options: [
                { id: "a", text: "Log everything, forever" },
                { id: "b", text: "Log only what’s needed; avoid sensitive data by default" },
                { id: "c", text: "Never log any errors" },
                { id: "d", text: "Store screenshots of user text" },
              ],
              correctIndex: 1,
              explanation: "Minimal, relevant telemetry supports debugging while reducing privacy risk.",
            },
          ],
        },
        bonuses: {
          knowledge: 2,
          confidence: 1,
        },
      },
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
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-bonus-architecture"],
    progressDelta: {
      retrieval: 6,
      evaluation: 8,
      interface: 10,
    },
    capabilityUnlocks: ["hasDashboard"],
  },
};
