module.exports = {
  config: {
    name: "waifu",
    aliases: ["wife"],
    description: "Send random waifu image",
    usage: "waifu",
    cooldown: 5,
    role: 0,
    author: "Eren",
    category: "anime"
  },

  async run({ api, event, logger }) {
    try {
      const axios = require("axios");

      const res = await axios.get(
        "https://nekos.life/api/v2/img/waifu"
      );

      await api.sendPhotoFromUrl(
        event.threadId,
        res.data.url
      );

    } catch (error) {
      logger.error("Waifu command error", { error: error.message });

      await api.sendMessage(
        "Waifu image unavailable.",
        event.threadId
      );
    }
  }
};
