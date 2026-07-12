'use strict';

const axios = require('axios');

async function fetchAnimeVideos(query) {
  const response = await axios.get(
    `https://lyric-search-neon.vercel.app/kshitiz?keyword=${encodeURIComponent(query)}`,
    {
      timeout: 15000
    }
  );

  return response.data;
}

module.exports = {
  config: {
    name: 'anisearch',
    aliases: ['anime', 'animeedit'],
    description: 'Search for anime edit videos',
    usage: 'anisearch <query>',
    cooldown: 10,
    role: 0,
    author: 'Eren',
    category: 'fun'
  },

  async run({ api, event, args, logger }) {
    const threadID = event.threadID || event.threadId;

    try {
      if (!args.length) {
        return api.sendMessage(
          '❌ Please provide a search query.\n\nExample: anisearch naruto',
          threadID
        );
      }

      const query = args.join(' ');
      const searchQuery = `${query} anime edit`;

      if (api.sendReaction) {
        await api.sendReaction('✨', event.messageId);
      }

      const data = await fetchAnimeVideos(searchQuery);

      const videos = Array.isArray(data)
        ? data
        : data.videos || data.results || data.data || [];

      if (!videos.length) {
        return api.sendMessage(
          `❌ No anime edits found for: ${query}`,
          threadID
        );
      }

      const selected = videos[Math.floor(Math.random() * videos.length)];

      const videoUrl =
        selected.videoUrl ||
        selected.video_url ||
        selected.url ||
        selected.link;

      if (!videoUrl) {
        return api.sendMessage(
          '❌ Video URL not found from API.',
          threadID
        );
      }

      await api.sendVideoFromUrl(
        threadID,
        videoUrl
      );

    } catch (error) {
      logger.error('anisearch error', {
        error: error.message
      });

      await api.sendMessage(
        '❌ An error occurred while fetching the video. Please try again later.',
        threadID
      );
    }
  }
};
