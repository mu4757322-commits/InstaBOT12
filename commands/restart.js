module.exports = {
  config: {
    name: "restart",
    aliases: ["reboot", "reload"],
    description: "Restart the bot (Admin only)",
    usage: "restart",
    role: 0,
    cooldown: 10,
    author: "Eren",
    category: "system"
  },

  async run({ api, event, logger }) {
    try {
      await api.sendReaction("⏳", event.messageID);

      await api.sendMessage(
        "🔄 Bot is restarting...\n⏱️ Please wait a few seconds.",
        event.threadID
      );

      logger.info(`Restart requested by ${event.senderID}`);

      setTimeout(() => {
        process.exit(0);
      }, 1500);

    } catch (err) {
      logger.error("Restart Error:", err);
      api.sendMessage(
        "❌ Failed to restart the bot.",
        event.threadID
      );
    }
  }
};
