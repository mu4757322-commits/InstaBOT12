const yts = require("yt-search");
const play = require("play-dl");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "audio",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Eren",
    description: "Play song audio",
    commandCategory: "music",
    usages: "audio <song name>",
    cooldowns: 10,
    aliases: ["song", "music"]
};

module.exports.run = async function({ api, event, args }) {

    const threadID = event.threadID;

    try {

        if (!args || args.length === 0) {
            return api.sendMessage(
                "🎵 Song name দাও\n\nExample:\n!audio Believer",
                threadID
            );
        }


        const query = args.join(" ");


        const result = await yts(query);


        if (!result.videos.length) {
            return api.sendMessage(
                "❌ Song পাওয়া যায়নি।",
                threadID
            );
        }


        const song = result.videos[0];


        await api.sendMessage(
`🎶 Song Found

📌 ${song.title}
⏱️ ${song.timestamp}

⬇️ Downloading audio...`,
            threadID
        );


        const stream = await play.stream(song.url, {
            quality: 2
        });


        const cache = path.join(
            __dirname,
            "../cache"
        );


        await fs.ensureDir(cache);


        const file = path.join(
            cache,
            `song_${Date.now()}.mp3`
        );


        const writer = fs.createWriteStream(file);


        stream.stream.pipe(writer);



        writer.on("finish", async () => {

            try {

                await api.sendAudio(
                    file,
                    threadID
                );


            } catch(err) {

                console.log(
                    "Send Audio Error:",
                    err
                );

                await api.sendMessage(
                    "❌ Audio send failed.",
                    threadID
                );

            }


            setTimeout(() => {
                fs.remove(file)
                .catch(() => {});
            }, 60000);


        });


    } catch(error) {

        console.log(
            "Audio Error:",
            error
        );


        return api.sendMessage(
            "❌ Audio command failed.\n" +
            error.message,
            threadID
        );

    }
};
