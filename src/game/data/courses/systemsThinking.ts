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
