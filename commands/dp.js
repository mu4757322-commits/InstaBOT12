module.exports = {
  config: {
    name: "dp",
    aliases: ["avatar", "pp"],
    description: "Show user's profile picture",
    usage: "dp [@mention]",
    cooldown: 5,
    role: 0,
    author: "Eren",
    category: "user"
  },

  async run({ api, event }) {
    try {

      let userID = event.senderID;

      // Mention check
      if (event.mentions && Object.keys(event.mentions).length > 0) {
        userID = Object.keys(event.mentions)[0];
      }

      const imageURL = `https://graph.facebook.com/${userID}/picture?width=720&height=720`;

      await api.sendMessage(
        {
          attachment: await global.utils.getStreamFromURL(imageURL)
        },
        event.threadID
      );

    } catch (err) {

      console.error("DP Error:", err);

      api.sendMessage(
        "❌ Failed to get profile picture.",
        event.threadID
      );

    }
  }
};
