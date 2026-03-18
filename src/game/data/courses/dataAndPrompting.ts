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
      gradedAssessment: {
        id: "dpb-quiz-01",
        courseId: "data-prompting-basics",
        lessonId: "lesson-dpb-01",
        week: 1,
        type: "quiz",
        mode: "graded",
        title: "Quiz: Data & Prompting (Week 1)",
        description: "One attempt. Submitting completes the lesson.",
        weight: 40,
        passingScore: 70,
        questions: [
          {
            id: "q1",
            type: "mcq",
            prompt: "In a chat model, what is the main control surface you provide?",
            options: [
              { id: "a", text: "The model’s training dataset" },
              { id: "b", text: "Your prompt/context (instructions, examples, constraints)" },
              { id: "c", text: "The user’s CPU speed" },
              { id: "d", text: "A database schema" },
            ],
            correctIndex: 1,
            explanation: "The prompt is the context the model conditions on when generating outputs.",
          },
          {
            id: "q2",
            type: "mcq",
            prompt: "Why do ambiguous prompts often produce inconsistent answers?",
            options: [
              { id: "a", text: "Because the model tries to guess the missing constraints" },
              { id: "b", text: "Because all models are deterministic" },
              { id: "c", text: "Because formatting never matters" },
              { id: "d", text: "Because context is ignored" },
            ],
            correctIndex: 0,
            explanation: "If you don’t specify audience/length/format, the model will fill in the blanks.",
          },
          {
            id: "q3",
            type: "mcq",
            prompt: "Which prompt change is most likely to improve output consistency?",
            options: [
              { id: "a", text: "Remove all constraints" },
              { id: "b", text: "Specify the output format explicitly" },
              { id: "c", text: "Ask for ‘the best answer’" },
              { id: "d", text: "Use fewer words but keep it vague" },
            ],
            correctIndex: 1,
            explanation: "Explicit formats (bullets/JSON/table) reduce ambiguity and stabilize outputs.",
          },
        ],
      },
      studyExtension: {
        recapBlocks: [
          {
            type: "text",
            text:
              "Recap: prompting is giving clear instructions + constraints so a model can produce useful output.",
          },
        ],
        extraBlocks: [
          {
            type: "tip",
            text:
              "Extra: Add one constraint at a time (format, tone, length). If output drifts, tighten the spec.",
          },
          {
            type: "example",
            title: "Structure helps",
            text:
              "Instead of ‘summarize this’, try: ‘Summarize in 3 bullets, each ≤ 12 words, focus on risks.’",
          },
        ],
        practiceAssessment: {
          id: "dpb-practice-01",
          courseId: "data-prompting-basics",
          lessonId: "lesson-dpb-01",
          week: 1,
          type: "quiz",
          mode: "practice",
          title: "Practice: Data & Prompting (Week 1)",
          description: "Practice only — does not affect your grade.",
          questions: [
            {
              id: "pq1",
              type: "mcq",
              prompt: "A good prompt usually includes…",
              options: [
                { id: "a", text: "Clear goal + constraints" },
                { id: "b", text: "Only emojis" },
                { id: "c", text: "No context at all" },
                { id: "d", text: "As many buzzwords as possible" },
              ],
              correctIndex: 0,
              explanation: "Clarity and constraints make outputs more reliable.",
            },
            {
              id: "pq2",
              type: "mcq",
              prompt: "If the model output is too long, the best fix is to…",
              options: [
                { id: "a", text: "Ask for a specific length/format" },
                { id: "b", text: "Remove all requirements" },
                { id: "c", text: "Add unrelated details" },
                { id: "d", text: "Assume it will improve later" },
              ],
              correctIndex: 0,
              explanation: "Explicit length and format constraints are the simplest control.",
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
        projectCategory: "prompting",
      },
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
          type: "video",
          title: "Prompt structure: goal + constraints + format",
          url: "https://www.youtube.com/watch?v=jC4v5AS4RIM",
        },
        {
          type: "example",
          title: "Good vs. bad",
          text:
            "Bad: ‘Make flashcards.’ Better: ‘Create 10 flashcards as JSON {question, answer}, based only on the notes below.’",
        },
        { type: "tip", text: "If you want JSON, say JSON first—and include a tiny schema." },
      ],
      gradedAssessment: {
        id: "dpb-checkpoint-02",
        courseId: "data-prompting-basics",
        lessonId: "lesson-dpb-02",
        week: 2,
        type: "checkpoint",
        mode: "graded",
        title: "Checkpoint: Data & Prompting (Week 2)",
        description: "Checkpoint test. One attempt.",
        weight: 60,
        passingScore: 70,
        questions: [
          {
            id: "cp1",
            type: "mcq",
            prompt: "Which prompt section most directly controls the *shape* of the output?",
            options: [
              { id: "a", text: "Goal" },
              { id: "b", text: "Constraints" },
              { id: "c", text: "Format" },
              { id: "d", text: "Role name" },
            ],
            correctIndex: 2,
            explanation: "Format is where you ask for bullets/JSON/table and specify a schema.",
          },
          {
            id: "cp2",
            type: "mcq",
            prompt: "A good ‘constraint’ is best described as…",
            options: [
              { id: "a", text: "A rule like ‘use only the provided notes’" },
              { id: "b", text: "A vague request to be creative" },
              { id: "c", text: "A list of unrelated keywords" },
              { id: "d", text: "A hidden system prompt you can’t control" },
            ],
            correctIndex: 0,
            explanation: "Constraints are the rules that bound what the model should/shouldn’t do.",
          },
          {
            id: "cp3",
            type: "mcq",
            prompt: "Why does specifying JSON in a prompt help in product code?",
            options: [
              { id: "a", text: "It makes outputs shorter automatically" },
              { id: "b", text: "It makes outputs easier to parse and validate" },
              { id: "c", text: "It guarantees the model is correct" },
              { id: "d", text: "It removes the need for testing" },
            ],
            correctIndex: 1,
            explanation: "Structured output lets your UI/logic stay stable and fail safely with validation.",
          },
          {
            id: "cp4",
            type: "mcq",
            prompt: "Which prompt is most likely to be reliable?",
            options: [
              { id: "a", text: "‘Summarize this’" },
              { id: "b", text: "‘Explain it better’" },
              {
                id: "c",
                text: "‘Create 8 flashcards as JSON {question, answer}, based only on these notes’",
              },
              { id: "d", text: "‘Do the thing’" },
            ],
            correctIndex: 2,
            explanation: "It includes a goal, constraints, and a concrete output format.",
          },
          {
            id: "cp5",
            type: "mcq",
            prompt: "If you want the model to follow a strict schema, what’s a high-leverage addition?",
            options: [
              { id: "a", text: "A tiny schema/example of the desired JSON" },
              { id: "b", text: "A longer backstory" },
              { id: "c", text: "More adjectives" },
              { id: "d", text: "Ask it to ‘try harder’" },
            ],
            correctIndex: 0,
            explanation: "A small schema/example acts like a contract the model can imitate.",
          },
        ],
      },
      studyExtension: {
        recapBlocks: [
          {
            type: "text",
            text:
              "Recap: data quality (coverage, bias, noise) and evaluation criteria determine whether a prompt workflow is actually usable.",
          },
        ],
        extraBlocks: [
          {
            type: "tip",
            text:
              "Extra: Write a tiny ‘test set’ of 5–10 cases you care about. Iterate prompts against that list.",
          },
          {
            type: "example",
            title: "Mini test set",
            text:
              "If you’re generating study plans, include a case: ‘2 hours available, anxious, needs breaks’ and verify the output meets constraints.",
          },
        ],
        practiceAssessment: {
          id: "dpb-practice-02",
          courseId: "data-prompting-basics",
          lessonId: "lesson-dpb-02",
          week: 2,
          type: "checkpoint",
          mode: "practice",
          title: "Practice: Data & Prompting (Week 2)",
          description: "Practice only — does not affect your grade.",
          questions: [
            {
              id: "pq1",
              type: "mcq",
              prompt: "What’s the most useful purpose of a small test set for prompting?",
              options: [
                { id: "a", text: "To measure whether changes improve outputs on key cases" },
                { id: "b", text: "To avoid ever changing the prompt" },
                { id: "c", text: "To guarantee perfect accuracy" },
                { id: "d", text: "To replace real user feedback" },
              ],
              correctIndex: 0,
              explanation: "A tiny test set makes iteration measurable and repeatable.",
            },
            {
              id: "pq2",
              type: "mcq",
              prompt: "If your data has gaps (missing important cases), the most likely outcome is…",
              options: [
                { id: "a", text: "The system fails on those cases in production" },
                { id: "b", text: "The system becomes faster" },
                { id: "c", text: "The model automatically fixes the gaps" },
                { id: "d", text: "Evaluation is unnecessary" },
              ],
              correctIndex: 0,
              explanation: "Models can’t learn patterns from cases they never see.",
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
      workbenchHooks: {
        projectCategory: "knowledgeBase",
        progressMultiplier: 1.15,
      },
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
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-techstack", "feature-features"],
    progressDelta: {
      prompting: 10,
      knowledgeBase: 8,
      retrieval: 6,
    },
    capabilityUnlocks: ["hasPromptTemplates"],
  },
};
