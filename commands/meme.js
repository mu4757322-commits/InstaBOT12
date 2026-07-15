const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "meme",
    version: "1.0.0",
    hasPermission: 0,
    credits: "InstaBOT",
    description: "Random meme from internet",
    commandCategory: "fun",
    usages: "meme",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    try {
        const response = await axios.get("https://meme-api.com/gimme");
        const data = response.data;

        const cacheDir = path.join(__dirname, "..", "cache");
        await fs.ensureDir(cacheDir);

        const filePath = path.join(cacheDir, `meme_${Date.now()}.jpg`);

        const image = await axios({
            url: data.url,
            method: "GET",
            responseType: "stream"
        });

        image.data.pipe(fs.createWriteStream(filePath));

        image.data.on("end", () => {
            api.sendMessage(
                {
                    body:
                        "😂 " + data.title +
                        "\n👤 Author: " + data.author +
                        "\n📂 r/" + data.subreddit +
                        "\n👍 " + data.ups + " Upvotes",
                    attachment: fs.createReadStream(filePath)
                },
                event.threadID,
                () => {
                    fs.unlink(filePath, () => {});
                },
                event.messageID
            );
        });

    } catch (err) {
        console.error(err);
        api.sendMessage(
            "❌ Failed to fetch meme.",
            event.threadID,
            event.messageID
        );
    }
};
