const axios = require("axios");

module.exports = {
  config: {
    name: "pair",
    aliases: ["couple", "love"],
    description: "Random couple with profile pictures",
    usage: "pair",
    cooldown: 10,
    role: 0,
    author: "Eren",
    category: "fun"
  },

  async run({ api, event }) {
    try {

      const senderID = event.senderID;

      const threadInfo =
        await api.getThreadInfo(event.threadID);

      const members =
        threadInfo.participantIDs.filter(
          id => id != senderID
        );


      if (!members.length) {
        return api.sendMessage(
          "❌ No partner found.",
          event.threadID
        );
      }


      const partnerID =
        members[
          Math.floor(Math.random() * members.length)
        ];


      const userInfo =
        await api.getUserInfo(senderID);

      const partnerInfo =
        await api.getUserInfo(partnerID);


      const name1 =
        userInfo[senderID]?.name || "User";

      const name2 =
        partnerInfo[partnerID]?.name || "User";


      const love =
        Math.floor(Math.random() * 51) + 50;


      let status =
        love >= 90 ? "💖 Soulmate Couple" :
        love >= 75 ? "💕 Cute Couple" :
        love >= 60 ? "❤️ Good Match" :
        "😂 Just Friends";


      const img1 =
        `https://graph.facebook.com/${senderID}/picture?width=720&height=720`;

      const img2 =
        `https://graph.facebook.com/${partnerID}/picture?width=720&height=720`;


      const message =
`💞 RANDOM COUPLE MATCH 💞

👤 ${name1}
❤️
👤 ${name2}

💕 Love: ${love}%

✨ ${status}

🌸 Anime Couple Mode`;


      // Send text + two DP links
      return api.sendMessage(
        {
          body: message,
          attachment: [
            await global.utils.getStreamFromURL(img1),
            await global.utils.getStreamFromURL(img2)
          ]
        },
        event.threadID
      );


    } catch (err) {

      console.log("Pair Error:", err);

      return api.sendMessage(
        "❌ Pair command failed.",
        event.threadID
      );

    }
  }
};
