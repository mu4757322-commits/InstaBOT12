const axios = require("axios");

module.exports = {
  config: {
    name: "testimg",
    category: "test"
  },

  async run({ api, event }) {

    let url = "https://i.imgur.com/4AiXzf8.jpeg";

    api.sendMessage(
      {
        body: "Test Image",
        attachment: await axios.get(url, {
          responseType: "stream"
        }).then(res => res.data)
      },
      event.threadID
    );

  }
};
