const axios = require("axios");
const fs = require("fs");
const path = require("path");

class Downloader {
  constructor() {
    this.cacheDir = path.join(__dirname, "../cache");

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async download(url, fileName = null) {
    if (!url) throw new Error("Download URL is required.");

    const ext =
      path.extname(url.split("?")[0]) || ".tmp";

    const name =
      fileName || `${Date.now()}${ext}`;

    const filePath = path.join(this.cacheDir, name);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        resolve(filePath);
      });

      writer.on("error", err => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(err);
      });
    });
  }

  delete(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {}
  }

  exists(filePath) {
    return fs.existsSync(filePath);
  }

  getStream(filePath) {
    return fs.createReadStream(filePath);
  }

  clearCache() {
    if (!fs.existsSync(this.cacheDir)) return;

    const files = fs.readdirSync(this.cacheDir);

    for (const file of files) {
      try {
        fs.unlinkSync(path.join(this.cacheDir, file));
      } catch (e) {}
    }
  }

  getCacheSize() {
    if (!fs.existsSync(this.cacheDir)) return 0;

    let size = 0;

    const files = fs.readdirSync(this.cacheDir);

    for (const file of files) {
      size += fs.statSync(path.join(this.cacheDir, file)).size;
    }

    return size;
  }
}

module.exports = new Downloader();
