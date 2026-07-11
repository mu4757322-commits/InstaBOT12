const axios = require("axios");

module.exports = {
  config: {
    name: "meme",
    aliases: ["memes"],
    description: "Get a random meme",
    usage: "meme",
    cooldown: 5,
    role: 0,
    author: "Eren",
    category: "fun"
  },

  async run({ api, event, logger }) {
    try {
      const { data } = await axios.get("https://meme-api.com/gimme");

      await api.sendMessage({
        body: `😂 ${data.title}\n\n👍 Upvotes: ${data.ups}`,
        attachment: await global.utils.getStreamFromURL(data.url)
      }, event.threadID);

    } catch (err) {
      logger.error("meme error", err);

      api.sendMessage(
        "❌ Failed to fetch meme. Please try again later.",
        event.threadID
      );
    }
  }
};
