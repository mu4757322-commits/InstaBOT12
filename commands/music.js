const play = require("play-dl");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "music",
    aliases: ["song"],
    description: "Search and send music",
    usage: "music <song name>",
    cooldown: 10,
    role: 0,
    author: "Eren",
    category: "media"
  },

  async run({ api, event, args, logger }) {
    const query = args.join(" ");
    const threadID = event.threadID || event.threadId;

    if (!query) {
      return api.sendMessage(
        "⚠️ Use: music <song name>",
        threadID
      );
    }

    let filePath;

    try {
      await api.sendMessage(
        `🔍 Searching: ${query}`,
        threadID
      );

      const result = await play.search(query, {
        limit: 1
      });

      if (!result.length) {
        return api.sendMessage(
          "❌ Song not found.",
          threadID
        );
      }

      const song = result[0];

      await api.sendMessage(
        `🎵 Found: ${song.title}\n⏳ Downloading...`,
        threadID
      );

      const streamData = await play.stream(song.url);

      filePath = path.join(
        __dirname,
        `song_${Date.now()}.mp3`
      );

      const writer = fs.createWriteStream(filePath);

      streamData.stream.pipe(writer);

      writer.on("finish", async () => {
        try {
          await api.sendAudio(
            filePath,
            threadID
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

        } catch (err) {
          logger.error("Send audio error", {
            error: err.message
          });
        }
      });

      writer.on("error", (err) => {
        logger.error("Write error", {
          error: err.message
        });

        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

    } catch (error) {
      logger.error("Music error", {
        error: error.message
      });

      await api.sendMessage(
        "❌ Music failed: " + error.message,
        threadID
      );
    }
  }
};
