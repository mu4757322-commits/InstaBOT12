module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    description: "Random Quiz Game",
    usage: "quiz",
    cooldown: 5,
    category: "game"
  },

  async run({ api, event }) {

    const quiz = require("./quiz.json");

    let index = Math.floor(Math.random() * quiz.length);
    let q = quiz[index];

    api.sendMessage(
`🎯 QUIZ TIME 🎯

❓ ${q.question}

${q.options.join("\n")}

💬 Reply A / B / C / D`,
      event.threadID,
      (err, info) => {

        global.client.handleReply.push({
          name: "quiz",
          messageID: info.messageID,
          answer: q.answer
        });

      }
    );
  },


  async handleReply({ api, event, handleReply }) {

    let answer = event.body.trim().toUpperCase();

    if (!["A","B","C","D"].includes(answer)) return;

    if (answer === handleReply.answer) {

      api.sendMessage(
`✅ Correct Answer!
🔥 Next Question Coming...`,
        event.threadID
      );

    } else {

      api.sendMessage(
`❌ Wrong Answer!

✅ Correct Answer: ${handleReply.answer}
🔥 Next Question Coming...`,
        event.threadID
      );

    }

  }
};
