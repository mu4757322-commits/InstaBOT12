const axios = require("axios");

const BASE_URL = "https://noobs-api.top/dipto/baby";

module.exports = {
  config: {
    name: "bby",
    aliases: ["baby", "babe", "chat"],
    description: "AI Chat Assistant",
    usage: "bby <message>",
    cooldown: 3,
    role: 0,
    category: "ai"
  },

  async run({ api, event, args, logger }) {

    const threadID = event.threadID || event.threadId;
    const uid = event.senderID;

    if (!args.length) {
      return api.sendMessage(
        "🤖 Bolo, ami shunchi...",
        threadID
      );
    }

    const text = args.join(" ");

    try {

      // Teach AI
      if (text.toLowerCase().startsWith("teach ")) {

        let data = text.substring(6).split(/\s*-\s*/);

        if (data.length < 2) {
          return api.sendMessage(
            "❌ Format:\nbby teach question - answer",
            threadID
          );
        }

        let question = data[0];
        let answer = data.slice(1).join("-");

        let res = await axios.get(
          `${BASE_URL}?teach=${encodeURIComponent(question)}&reply=${encodeURIComponent(answer)}&senderID=${uid}`
        );

        return api.sendMessage(
          "✅ Learned!\n" + res.data.message,
          threadID
        );
      }


      // Remove taught reply
      if (text.toLowerCase().startsWith("remove ")) {

        let msg = text.substring(7);

        let res = await axios.get(
          `${BASE_URL}?remove=${encodeURIComponent(msg)}&senderID=${uid}`
        );

        return api.sendMessage(
          res.data.message,
          threadID
        );
      }


      // Show teaches
      if (text.toLowerCase() === "list") {

        let res = await axios.get(
          `${BASE_URL}?list=all`
        );

        return api.sendMessage(
          `📚 Total Learned: ${res.data.length || 0}`,
          threadID
        );
      }


      // AI Chat
      let res = await axios.get(
        `${BASE_URL}?text=${encodeURIComponent(text)}&senderID=${uid}&font=1`
      );


      let reply = res.data.reply || "Hmm...";

      return api.sendMessage(
        "🤖 AI:\n\n" + reply,
        threadID
      );


    } catch (err) {

      logger.error(err);

      return api.sendMessage(
        "❌ AI server busy right now.",
        threadID
      );

    }
  }
};
