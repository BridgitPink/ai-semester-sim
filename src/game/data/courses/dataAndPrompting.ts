import type { Course } from "../../types/course";

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
