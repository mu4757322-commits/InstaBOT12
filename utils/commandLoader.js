const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const config = require('../config');

class CommandLoader {
  constructor() {
    this.commands = new Map();
    this.cooldowns = new Map();
  }

  async loadCommands() {
    const commandsPath = path.resolve(config.COMMANDS_PATH);

    if (!fs.existsSync(commandsPath)) {
      logger.warn('Commands folder missing, creating...');
      fs.mkdirSync(commandsPath, { recursive: true });
      return;
    }

    const files = fs.readdirSync(commandsPath)
      .filter(file => file.endsWith('.js'));

    logger.info(`Found ${files.length} command files`);

    for (const file of files) {
      const filePath = path.join(commandsPath, file);

      try {
        delete require.cache[require.resolve(filePath)];

        const command = require(filePath);

        if (!command.config?.name) {
          logger.warn(`Skipped ${file}: missing config.name`);
          continue;
        }

        const name = command.config.name.toLowerCase();

        if (this.commands.has(name)) {
          logger.warn(`Duplicate command: ${name}`);
        }

        this.commands.set(name, command);

        if (Array.isArray(command.config.aliases)) {
          command.config.aliases.forEach(alias => {
            this.commands.set(alias.toLowerCase(), command);
          });
        }

        logger.info(`Loaded: ${name}`);

      } catch (err) {
        logger.error(`Failed loading ${file}: ${err.stack}`);
      }
    }

    logger.info(`Total commands loaded: ${this.commands.size}`);
  }


  getCommand(name) {
    return this.commands.get(name.toLowerCase()) || null;
  }


  checkCooldown(userId, commandName, cooldown) {
    const key = `${userId}-${commandName}`;

    if (!this.cooldowns.has(key)) return 0;

    const time = this.cooldowns.get(key);

    if (Date.now() < time) {
      return Math.ceil((time - Date.now()) / 1000);
    }

    this.cooldowns.delete(key);
    return 0;
  }


  setCooldown(userId, commandName, cooldown) {
    const key = `${userId}-${commandName}`;

    this.cooldowns.set(
      key,
      Date.now() + cooldown
    );

    setTimeout(() => {
      this.cooldowns.delete(key);
    }, cooldown);
  }


  async reloadCommands() {
    this.commands.clear();
    await this.loadCommands();
  }


  getAllCommandNames() {
    return [...new Set(
      [...this.commands.values()]
      .map(cmd => cmd.config.name)
    )];
  }
}

module.exports = CommandLoader;
