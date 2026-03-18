import type { Course } from "../../types/course";

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
      gradedAssessment: {
        id: "aif-quiz-01",
        courseId: "ai-foundations",
        lessonId: "lesson-aif-01",
        week: 1,
        type: "quiz",
        mode: "graded",
        title: "Quiz: AI Foundations (Week 1)",
        description: "One attempt. Submitting completes the lesson.",
        weight: 40,
        passingScore: 70,
        questions: [
          {
            id: "q1",
            type: "mcq",
            prompt: "Which statement best describes machine learning?",
            options: [
              { id: "a", text: "A set of hard-coded rules written by engineers" },
              { id: "b", text: "A method where models learn patterns from data to make predictions" },
              { id: "c", text: "A synonym for deep learning" },
              { id: "d", text: "A database query technique" },
            ],
            correctIndex: 1,
            correctOptionId: "b",
            explanation: "ML learns a mapping from examples; it’s not rules or only deep learning.",
          },
          {
            id: "q2",
            type: "truefalse",
            prompt: "A model can be accurate on training data but still fail on new real-world data.",
            correctAnswer: true,
            explanation: "This is the core intuition behind overfitting and the need for evaluation on unseen data.",
          },
        ],
      },
      studyExtension: {
        recapBlocks: [
          {
            type: "tip",
            text: "Quick recap: write input → model → output to clarify what an AI feature actually does.",
          },
        ],
        extraBlocks: [
          {
            type: "text",
            text:
              "Extra: A useful way to sanity-check an AI idea is to name the *data*. What examples would you collect? Who would label them? What would ‘wrong’ look like?",
          },
          {
            type: "example",
            title: "Input → output practice",
            text:
              "Movie recommendation: input = your watch history, output = a ranked list of movies. The model learns patterns from many users’ histories.",
          },
        ],
        practiceAssessment: {
          id: "aif-practice-01",
          courseId: "ai-foundations",
          lessonId: "lesson-aif-01",
          week: 1,
          type: "quiz",
          mode: "practice",
          title: "Practice: AI Foundations (Week 1)",
          description: "Practice only — does not affect your grade.",
          questions: [
            {
              id: "pq1",
              type: "mcq",
              prompt: "Deep learning is best described as…",
              options: [
                { id: "a", text: "A family of ML techniques often using neural networks" },
                { id: "b", text: "A replacement for data collection" },
                { id: "c", text: "A synonym for AI" },
                { id: "d", text: "A way to label datasets automatically" },
              ],
              correctIndex: 0,
              correctOptionId: "a",
              explanation: "Deep learning is a subset of ML; it still depends on data and training.",
            },
            {
              id: "pq2",
              type: "mcq",
              prompt: "Which mental model is most helpful when you’re confused by an AI feature?",
              options: [
                { id: "a", text: "Input → model → output" },
                { id: "b", text: "Pixels → vibes → magic" },
                { id: "c", text: "Faster computer = smarter output" },
                { id: "d", text: "More buzzwords = better model" },
              ],
              correctIndex: 0,
              explanation: "Writing the pipeline forces clarity about what the system actually does.",
            },
          ],
        },
        bonuses: {
          knowledge: 3,
          focus: 2,
        },
      },
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
          type: "video",
          title: "Supervised learning in one picture",
          url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
        },
        {
          type: "example",
          title: "Label design",
          text:
            "If your task is ‘help triage support tickets,’ a useful label might be the category (billing, bug, account) — not ‘good’ vs ‘bad’. Better labels make better models.",
        },
        {
          type: "tip",
          text:
            "If you can’t clearly define labels, the ML project probably isn’t ready yet.",
        },
      ],
      gradedAssessment: {
        id: "aif-checkpoint-02",
        courseId: "ai-foundations",
        lessonId: "lesson-aif-02",
        week: 2,
        type: "checkpoint",
        mode: "graded",
        title: "Checkpoint: AI Foundations (Week 2)",
        description: "Checkpoint test. One attempt.",
        weight: 60,
        passingScore: 70,
        questions: [
          {
            id: "cp1",
            type: "mcq",
            prompt: "In supervised learning, what does a ‘label’ represent?",
            options: [
              { id: "a", text: "A model’s internal weights" },
              { id: "b", text: "The correct output/target for an input example" },
              { id: "c", text: "A random identifier for a dataset row" },
              { id: "d", text: "The prompt given to an LLM" },
            ],
            correctIndex: 1,
            explanation: "Labels are the target values you want the model to predict from inputs.",
          },
          {
            id: "cp2",
            type: "mcq",
            prompt: "Which workflow best matches supervised learning?",
            options: [
              { id: "a", text: "Collect inputs only → train → hope" },
              { id: "b", text: "Collect inputs + labels → train → evaluate on unseen data" },
              { id: "c", text: "Write rules → deploy → never update" },
              { id: "d", text: "Ask the model for the labels at runtime" },
            ],
            correctIndex: 1,
            explanation: "Supervised learning requires labeled examples and evaluation on new data.",
          },
          {
            id: "cp3",
            type: "mcq",
            prompt: "Why can ‘better model code’ fail to improve results?",
            options: [
              { id: "a", text: "Because labels and data quality often dominate performance" },
              { id: "b", text: "Because supervised learning ignores labels" },
              { id: "c", text: "Because training data is irrelevant" },
              { id: "d", text: "Because evaluation is always unnecessary" },
            ],
            correctIndex: 0,
            explanation: "If labels are noisy or data is unrepresentative, model tweaks won’t help much.",
          },
          {
            id: "cp4",
            type: "mcq",
            prompt: "Which is the best example of a well-defined label for a support-ticket assistant?",
            options: [
              { id: "a", text: "‘Good ticket’ vs ‘bad ticket’" },
              { id: "b", text: "Ticket category (billing, bug, account, other)" },
              { id: "c", text: "The customer’s full personal profile" },
              { id: "d", text: "A random number from 1–100" },
            ],
            correctIndex: 1,
            explanation: "Categories are actionable targets; vague labels don’t help the system.",
          },
          {
            id: "cp5",
            type: "mcq",
            prompt: "What is the main reason labels can be expensive?",
            options: [
              { id: "a", text: "They require human time, expertise, and consistency" },
              { id: "b", text: "They are generated automatically by GPUs" },
              { id: "c", text: "They don’t need review" },
              { id: "d", text: "They replace evaluation" },
            ],
            correctIndex: 0,
            explanation: "Labeling often needs careful human judgment and quality control.",
          },
        ],
      },
      studyExtension: {
        recapBlocks: [
          {
            type: "text",
            text:
              "Recap: supervised learning uses labeled examples to learn a mapping from inputs → labels.",
          },
        ],
        extraBlocks: [
          {
            type: "tip",
            text:
              "Extra: If two labelers disagree often, your label definition is probably too fuzzy.",
          },
          {
            type: "example",
            title: "Cost of labeling",
            text:
              "Medical images may require expert doctors to label. That’s slow and expensive, so dataset design matters a lot.",
          },
        ],
        practiceAssessment: {
          id: "aif-practice-02",
          courseId: "ai-foundations",
          lessonId: "lesson-aif-02",
          week: 2,
          type: "checkpoint",
          mode: "practice",
          title: "Practice: AI Foundations (Week 2)",
          description: "Practice only — does not affect your grade.",
          questions: [
            {
              id: "pq1",
              type: "mcq",
              prompt: "Which is the best description of a label?",
              options: [
                { id: "a", text: "The target output for an input example" },
                { id: "b", text: "A model’s hidden layer" },
                { id: "c", text: "A UI component" },
                { id: "d", text: "A training server" },
              ],
              correctIndex: 0,
              explanation: "Labels are what you want the model to learn to predict.",
            },
            {
              id: "pq2",
              type: "mcq",
              prompt: "A helpful first step in a supervised ML project is to…",
              options: [
                { id: "a", text: "Pick the neural network first" },
                { id: "b", text: "Define the label clearly and collect representative examples" },
                { id: "c", text: "Skip evaluation" },
                { id: "d", text: "Assume data quality doesn’t matter" },
              ],
              correctIndex: 1,
              explanation: "Clear labels + good examples set the ceiling for success.",
            },
          ],
        },
        bonuses: {
          knowledge: 3,
          confidence: 1,
        },
      },
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
      interactionType: "read",
      completionReward: { knowledge: 15, confidence: 10 },
    },
  ],
  milestoneReward: {
    projectFeatures: ["feature-readme", "feature-problem-statement"],
    progressDelta: {
      prompting: 6,
      evaluation: 8,
    },
  },
};
