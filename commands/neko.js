module.exports = {
  config: {
    name: "neko",
    aliases: ["catgirl"],
    description: "Send random neko image",
    usage: "neko",
    cooldown: 5,
    role: 0,
    author: "Eren",
    category: "anime"
  },

  async run({ api, event, logger }) {
    try {
      const axios = require("axios");

      const res = await axios.get(
        "https://nekos.life/api/v2/img/neko"
      );

      await api.sendPhotoFromUrl(
        event.threadId,
        res.data.url
      );

    } catch (error) {
      logger.error("Neko command error", { error: error.message });

      await api.sendMessage(
        "Neko image unavailable.",
        event.threadId
      );
    }
  }
};
