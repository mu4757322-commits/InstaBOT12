const fs = require('fs-extra');

module.exports = {
  config: { name: 'approve', role: 2 }, // role 2 মানে শুধুমাত্র অ্যাডমিন (তুমি)

  async run({ api, event }) {
    const threadID = event.threadID;
    let approvedGroups = JSON.parse(fs.readFileSync('./approved_groups.json', 'utf8'));

    if (!approvedGroups.includes(threadID)) {
      approvedGroups.push(threadID);
      fs.writeFileSync('./approved_groups.json', JSON.stringify(approvedGroups));
      api.sendMessage("✅ গ্রুপটি অনুমোদিত হয়েছে! এখন থেকে আমি এখানে কাজ করব।", threadID);
    }
  }
};
