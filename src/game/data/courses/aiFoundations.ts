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
    progressDelta: {
      prompting: 6,
      evaluation: 8,
    },
  },
};
