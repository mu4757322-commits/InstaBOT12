const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

class ImageUtils {
  constructor() {
    this.cacheDir = path.join(__dirname, "../cache");

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async resize(input, width, height) {
    const output = path.join(
      this.cacheDir,
      `resize_${Date.now()}.jpg`
    );

    await sharp(input)
      .resize(width, height)
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async crop(input, width, height) {
    const output = path.join(
      this.cacheDir,
      `crop_${Date.now()}.jpg`
    );

    await sharp(input)
      .resize(width, height, {
        fit: "cover"
      })
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async rotate(input, degree) {
    const output = path.join(
      this.cacheDir,
      `rotate_${Date.now()}.jpg`
    );

    await sharp(input)
      .rotate(degree)
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async blur(input, level = 5) {
    const output = path.join(
      this.cacheDir,
      `blur_${Date.now()}.jpg`
    );

    await sharp(input)
      .blur(level)
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async grayscale(input) {
    const output = path.join(
      this.cacheDir,
      `gray_${Date.now()}.jpg`
    );

    await sharp(input)
      .grayscale()
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async flip(input) {
    const output = path.join(
      this.cacheDir,
      `flip_${Date.now()}.jpg`
    );

    await sharp(input)
      .flip()
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async flop(input) {
    const output = path.join(
      this.cacheDir,
      `flop_${Date.now()}.jpg`
    );

    await sharp(input)
      .flop()
      .jpeg({ quality: 90 })
      .toFile(output);

    return output;
  }

  async png(input) {
    const output = path.join(
      this.cacheDir,
      `png_${Date.now()}.png`
    );

    await sharp(input)
      .png()
      .toFile(output);

    return output;
  }

  async webp(input) {
    const output = path.join(
      this.cacheDir,
      `webp_${Date.now()}.webp`
    );

    await sharp(input)
      .webp({ quality: 90 })
      .toFile(output);

    return output;
  }

  async metadata(input) {
    return await sharp(input).metadata();
  }

  stream(filePath) {
    return fs.createReadStream(filePath);
  }

  delete(filePath) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = new ImageUtils();
