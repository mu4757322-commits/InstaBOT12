const yts = require('yt-search');

module.exports = {
  name: 'play',
  description: 'ইউটিউব থেকে গান খোঁজার কমান্ড',
  async execute(api, event, args) {
    const query = args.join(" ");
    if (!query) return api.sendMessage("দয়া করে একটি গানের নাম দিন!", event.threadID);

    try {
      const searchResult = await yts(query);
      if (searchResult.videos.length > 0) {
        const video = searchResult.videos[0];
        const message = `🎵 *গান পাওয়া গেছে*\n\n*টাইটেল:* ${video.title}\n*লিঙ্ক:* ${video.url}`;
        await api.sendMessage(message, event.threadID);
      } else {
        await api.sendMessage("❌ দুঃখিত, গানটি খুঁজে পাওয়া যায়নি।", event.threadID);
      }
    } catch (error) {
      await api.sendMessage("❌ গানটি খোঁজার সময় সমস্যা হয়েছে!", event.threadID);
    }
  }

};
