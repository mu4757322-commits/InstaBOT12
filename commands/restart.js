module.exports = {
  config: {
    name: "restart",
    aliases: ["reboot", "reload"],
    description: "Restart the bot with countdown",
    usage: "restart [seconds]",
    role: 0,
    cooldown: 30,
    author: "Eren",
    category: "system"
  },

  async run({ api, event, logger, args }) {
    try {

      let seconds = parseInt(args[0]) || 5;

      if (seconds < 3) seconds = 3;
      if (seconds > 60) seconds = 60;


      await api.sendReaction("⏳", event.messageID);


      let msg = await api.sendMessage(
        `🔄 Bot restart initiated!\n\n⏱️ Restarting in ${seconds} seconds...\n\n⚠️ Please wait.`,
        event.threadID
      );


      logger.info(
        `Restart requested by ${event.senderID}`
      );


      let count = seconds;


      const timer = setInterval(async () => {

        count--;


        if (count > 0) {

          await api.sendMessage(
            `⏳ Restarting in ${count} seconds...`,
            event.threadID
          );

        }


        if (count === 0) {

          clearInterval(timer);


          await api.sendMessage(
            "✅ Restart process completed.\n🤖 Bot is coming back online...",
            event.threadID
          );


          logger.info(
            "Bot shutting down for restart..."
          );


          setTimeout(() => {
            process.exit(0);
          }, 1000);

        }


      }, 1000);



    } catch (err) {

      logger.error(
        "Restart Error: " + err.message
      );


      api.sendMessage(
        "❌ Failed to restart the bot.",
        event.threadID
      );

    }
  }
};
