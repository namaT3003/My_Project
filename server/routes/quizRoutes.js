const express = require('express');
const router = express.Router();

const quizQuestions = {
  easy: [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correctAnswer: 1
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    }
  ],
  medium: [
    {
      question: "What is the largest organ in the human body?",
      options: ["Brain", "Heart", "Liver", "Skin"],
      correctAnswer: 3
    },
    {
      question: "In what year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2
    },
    {
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2
    }
  ],
  hard: [
    {
      question: "What is the Heisenberg Uncertainty Principle?",
      options: [
        "You cannot simultaneously know both the position and momentum of a particle",
        "All particles must be in a superposition state",
        "The universe is deterministic",
        "Energy cannot be created or destroyed"
      ],
      correctAnswer: 0
    },
    {
      question: "Which philosopher created the concept of the 'Categorical Imperative'?",
      options: ["Nietzsche", "Kant", "Hegel", "Descartes"],
      correctAnswer: 1
    },
    {
      question: "What is the molecular formula of glucose?",
      options: ["C6H12O6", "C5H10O5", "C7H14O7", "C4H8O4"],
      correctAnswer: 0
    }
  ]
};

// POST /api/quiz
router.post('/quiz', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    // Validation
    if (!topic || !difficulty) {
      return res.status(400).json({
        error: 'Topic and difficulty are required'
      });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        error: 'Difficulty must be easy, medium, or hard'
      });
    }

    // Get questions based on difficulty
    let questions = quizQuestions[difficulty];

    // Shuffle questions (optional)
    questions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      topic: topic,
      difficulty: difficulty,
      totalQuestions: questions.length,
      questions: questions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Quiz API Error:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      message: error.message
    });
  }
});

module.exports = router;