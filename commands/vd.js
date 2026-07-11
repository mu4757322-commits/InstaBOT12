const yts = require("yt-search");

module.exports = {
  config: {
    name: "vd",
    aliases: ["vd"],
    description: "Search YouTube videos",
    usage: "video <name>",
    cooldown: 5,
    category: "media"
  },

  async run({ api, event, args }) {

    if (!args.length) {
      return api.sendMessage(
        "❌ Please give video name\n\nExample:\nvideo Free Fire montage",
        event.threadID
      );
    }

    const search = args.join(" ");

    try {

      let result = await yts(search);

      let videos = result.videos.slice(0, 5);

      let msg = "🎬 VIDEO SEARCH RESULT\n\n";

      videos.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n`;
        msg += `⏱ ${v.timestamp}\n`;
        msg += `🔗 ${v.url}\n\n`;
      });

      api.sendMessage(
        msg,
        event.threadID
      );

    } catch (e) {

      api.sendMessage(
        "❌ Video search failed!",
        event.threadID
      );

    }
  }
};
