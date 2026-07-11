const axios = require("axios");

module.exports = {
  config: {
    name: "funny",
    aliases: ["funny", "fun"],
    description: "Send funny meme",
    usage: "funny",
    cooldown: 5,
    role: 0,
    category: "fun"
  },

  async run({ api, event }) {

    try {

      const res = await axios.get(
        "https://meme-api.com/gimme"
      );

      if (!res.data || !res.data.url) {
        throw new Error("No image found");
      }

      api.sendMessage(
        {
          body: `😂 ${res.data.title}`,
          attachment: await global.utils.getStreamFromURL(res.data.url)
        },
        event.threadID
      );

    } catch (e) {

      api.sendMessage(
        "❌ Meme server busy, আবার try করো 😅",
        event.threadID
      );

    }
  }
};
