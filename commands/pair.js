const axios = require("axios");

module.exports.config = {
    name: "pair",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Eren",
    description: "Random couple match with profile pictures",
    commandCategory: "fun",
    usages: "pair",
    cooldowns: 10,
    aliases: ["couple", "love"]
};

module.exports.run = async function({ api, event }) {
    try {

        const threadID = event.threadID;
        const senderID = event.senderID;


        const threadInfo = await api.getThread(threadID);

        const members =
            threadInfo.participantIDs?.filter(
                id => String(id) !== String(senderID)
            ) || [];


        if (!members.length) {
            return api.sendMessage(
                "❌ No partner found.",
                threadID
            );
        }


        const partnerID =
            members[Math.floor(Math.random() * members.length)];


        const senderInfo =
            await api.getUserInfo(senderID);

        const partnerInfo =
            await api.getUserInfo(partnerID);



        const name1 =
            senderInfo[senderID]?.name || "User";

        const name2 =
            partnerInfo[partnerID]?.name || "User";



        const love =
            Math.floor(Math.random() * 51) + 50;



        let status;

        if (love >= 90)
            status = "💖 Soulmate Couple";
        else if (love >= 75)
            status = "💕 Cute Couple";
        else if (love >= 60)
            status = "❤️ Good Match";
        else
            status = "😂 Just Friends";



        const dp1 =
            `https://graph.facebook.com/${senderID}/picture?width=720&height=720`;

        const dp2 =
            `https://graph.facebook.com/${partnerID}/picture?width=720&height=720`;



        const caption =
`💞 RANDOM COUPLE MATCH 💞

👤 ${name1}
      ❤️
👤 ${name2}

💕 Love Percentage: ${love}%

✨ Result: ${status}

🌸 Anime Couple Mode`;



        // Send first DP
        await api.sendPhotoFromUrl(
            threadID,
            dp1,
            {
                caption: caption
            }
        );


        // Send second DP
        await api.sendPhotoFromUrl(
            threadID,
            dp2
        );


    } catch (error) {

        console.error("PAIR ERROR:", error);

        return api.sendMessage(
            "❌ Pair command failed.\n\n" + error.message,
            event.threadID
        );
    }
};
