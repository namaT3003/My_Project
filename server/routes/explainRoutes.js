const express = require('express');
const router = express.Router();

const explanationTemplates = {
  friendly: (topic) => `
Alright, let's break down ${topic} in a super fun and easy way! 🎉

Think of ${topic} like... [simplified analogy]. Here's what you need to know:

✨ The Basics:
${topic} is basically about [main idea]. It's like [relatable example].

🎯 Key Points:
• [Point 1] - This means [explanation]
• [Point 2] - This means [explanation]
• [Point 3] - This means [explanation]

💡 Real-World Example:
Imagine [everyday example related to topic]. That's kind of how ${topic} works!

🚀 Why It Matters:
Understanding ${topic} helps you [practical benefit]. Cool right?

Remember: ${topic} is just [simplified summary]. Keep practicing and you'll get it! 💪
  `,

  beginner: (topic) => `
Let's Learn About ${topic}

📚 Definition:
${topic} is a [basic definition]. Simply put, it means [one-sentence explanation].

🧩 Basic Components:
1. [Component 1] - [Simple explanation]
2. [Component 2] - [Simple explanation]
3. [Component 3] - [Simple explanation]

📖 Easy Explanation:
${topic} works like this:
- First: [Step 1]
- Then: [Step 2]
- Finally: [Step 3]

✅ Things to Remember:
• Always [key point 1]
• Don't forget [key point 2]
• Practice [key point 3]

Start with these basics and build your understanding step by step!
  `,

  strict: (topic) => `
Technical Overview: ${topic}

Definition:
${topic} is formally defined as [technical definition]. It encompasses [technical scope].

Theoretical Framework:
${topic} operates within the following parameters:
- Axiom 1: [Technical principle]
- Axiom 2: [Technical principle]
- Axiom 3: [Technical principle]

Mathematical/Logical Foundation:
[Formal explanation with technical depth]

Applications:
1. [Professional application 1] - [Technical implications]
2. [Professional application 2] - [Technical implications]
3. [Professional application 3] - [Technical implications]

Advanced Considerations:
• [Complex aspect 1]
• [Complex aspect 2]
• [Complex aspect 3]

Current State of Research:
[Latest developments and technical advances in the field]

References for Further Study:
Consult peer-reviewed journals and technical documentation for comprehensive analysis.
  `,

  exam: (topic) => `
EXAM STUDY GUIDE: ${topic}

📋 Key Definitions:
Q: What is ${topic}?
A: [Clear definition for exam purposes]

Q: What are the main characteristics?
A: [List main features]

📌 Important Concepts:
1. [Concept Name]
   - Definition: [Definition]
   - Example: [Example]
   - Why important: [Reason]

2. [Concept Name]
   - Definition: [Definition]
   - Example: [Example]
   - Why important: [Reason]

3. [Concept Name]
   - Definition: [Definition]
   - Example: [Example]
   - Why important: [Reason]

✍️ Exam-Style Questions:
Q1: Explain [concept] in 2-3 sentences.
Q2: Compare [concept A] and [concept B].
Q3: Why is [concept] important? Give two reasons.
Q4: Describe the process of [topic].

🎯 Must-Know Points:
✓ [Point 1] - DEFINITELY on exam
✓ [Point 2] - VERY LIKELY on exam
✓ [Point 3] - PROBABLY on exam

💾 Quick Revision:
${topic} = [one-liner] → [key point 1] → [key point 2] → [key point 3]

Good luck! Study these points thoroughly. 📚
  `
};

// POST /api/explain
router.post('/explain', async (req, res) => {
  try {
    const { topic, mode } = req.body;

    // Validation
    if (!topic || !mode) {
      return res.status(400).json({ 
        error: 'Topic and mode are required',
        received: { topic, mode }
      });
    }

    if (!explanationTemplates[mode]) {
      return res.status(400).json({ 
        error: 'Invalid mode',
        validModes: ['friendly', 'beginner', 'strict', 'exam'],
        received: mode
      });
    }

    // Generate explanation
    const answer = explanationTemplates[mode](topic);

    // Simulate API delay for realistic loading state
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({ 
      success: true,
      answer: answer.trim(),
      topic: topic,
      mode: mode,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Explain API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate explanation',
      message: error.message 
    });
  }
});

module.exports = router;