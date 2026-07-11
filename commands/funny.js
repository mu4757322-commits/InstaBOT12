const axios = require("axios");

module.exports = {
  config: {
    name: "funny",
    aliases: ["funny", "fun"],
    description: "Send random funny pictures",
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

      const image = res.data.url;
      const title = res.data.title;

      api.sendMessage(
        {
          body: `😂 ${title}`,
          attachment: await global.utils.getStreamFromURL(image)
        },
        event.threadID
      );

    } catch (err) {

      api.sendMessage(
        "❌ Funny meme পাওয়া যায়নি 😅",
        event.threadID
      );

    }
  }
};
