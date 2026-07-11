  async run({ api, event }) {
    try {
      const axios = require('axios'); // axios লাইব্রেরি রিকোয়ার করুন
      let userID = event.senderID;

      if (event.mentions && Object.keys(event.mentions).length > 0) {
        userID = Object.keys(event.mentions)[0];
      }

      const imageURL = `https://graph.facebook.com/${userID}/picture?width=720&height=720`;

      // axios দিয়ে ইমেজ স্ট্রিম তৈরি করা হচ্ছে
      const response = await axios.get(imageURL, { responseType: 'stream' });

      await api.sendMessage(
        {
          attachment: response.data
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
