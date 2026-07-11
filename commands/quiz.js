module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    description: "Random Quiz Game",
    usage: "quiz",
    cooldown: 5,
    role: 0,
    author: "Eren",
    category: "game"
  },

  async run({ api, event }) {
    const quiz = [
      {
        question: "What is the capital of Bangladesh?",
        options: ["A. Dhaka", "B. Chattogram", "C. Khulna", "D. Rajshahi"],
        answer: "A"
      },
      {
        question: "2 + 2 = ?",
        options: ["A. 3", "B. 4", "C. 5", "D. 6"],
        answer: "B"
      },
      {
        question: "Which planet is called the Red Planet?",
        options: ["A. Earth", "B. Mars", "C. Venus", "D. Jupiter"],
        answer: "B"
      }
    ];

    const q = quiz[Math.floor(Math.random() * quiz.length)];

    api.sendMessage(
`${q.question}

${q.options.join("\n")}

Reply with A, B, C or D.

Correct Answer: ${q.answer}`,
      event.threadID
    );
  }
};
