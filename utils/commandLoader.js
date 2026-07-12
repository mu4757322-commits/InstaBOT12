const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const config = require("../config");

class CommandLoader {

  constructor() {
    this.commands = new Map();
    this.cooldowns = new Map();
    this.loadTime = 0;
  }


  async loadCommands() {

    const start = Date.now();

    const commandsPath = path.resolve(
      config.COMMANDS_PATH
    );


    if (!fs.existsSync(commandsPath)) {

      logger.warn(
        "Commands folder missing, creating..."
      );

      fs.mkdirSync(commandsPath, {
        recursive: true
      });

      return;
    }


    const files = fs.readdirSync(commandsPath)
      .filter(file =>
        file.endsWith(".js") &&
        !file.startsWith(".")
      );


    logger.info(
      `Found ${files.length} command files`
    );


    let loaded = 0;


    for (const file of files) {

      const filePath = path.join(
        commandsPath,
        file
      );


      try {

        delete require.cache[
          require.resolve(filePath)
        ];


        const command = require(filePath);


        if (
          !command ||
          !command.config ||
          !command.config.name
        ) {

          logger.warn(
            `Skipped ${file}: invalid command structure`
          );

          continue;
        }


        if (
          command.config.enabled === false
        ) {

          logger.warn(
            `Disabled: ${file}`
          );

          continue;
        }


        const name =
          command.config.name.toLowerCase();



        if (this.commands.has(name)) {

          logger.warn(
            `Duplicate command: ${name}`
          );

        }


        this.commands.set(
          name,
          command
        );


        if (
          Array.isArray(
            command.config.aliases
          )
        ) {

          command.config.aliases.forEach(alias => {

            const aliasName =
              alias.toLowerCase();


            if (this.commands.has(aliasName)) {

              logger.warn(
                `Duplicate alias: ${aliasName}`
              );

              return;
            }


            this.commands.set(
              aliasName,
              command
            );

          });

        }


        loaded++;


        logger.info(
          `Loaded: ${name}`
        );


      } catch (err) {

        logger.error(
          `Failed loading ${file}: ${err.message}`
        );

      }

    }


    this.loadTime =
      Date.now() - start;


    logger.info(
      `Loaded ${loaded} commands in ${this.loadTime}ms`
    );

  }



  getCommand(name) {

    if (!name) return null;

    return (
      this.commands.get(
        name.toLowerCase()
      ) || null
    );

  }



  getAllCommands() {

    return [
      ...new Set(
        [...this.commands.values()]
        .map(cmd => cmd.config.name)
      )
    ];

  }



  checkCooldown(
    userId,
    commandName,
    cooldown
  ) {

    if (!cooldown || cooldown <= 0)
      return 0;


    const key =
      `${userId}-${commandName}`;


    const expire =
      this.cooldowns.get(key);


    if (!expire)
      return 0;


    const remaining =
      expire - Date.now();


    if (remaining > 0) {

      return Math.ceil(
        remaining / 1000
      );

    }


    this.cooldowns.delete(key);

    return 0;

  }



  setCooldown(
    userId,
    commandName,
    cooldown
  ) {

    if (!cooldown || cooldown <= 0)
      return;


    const key =
      `${userId}-${commandName}`;


    const expire =
      Date.now() + cooldown * 1000;


    this.cooldowns.set(
      key,
      expire
    );


    setTimeout(() => {

      this.cooldowns.delete(key);

    }, cooldown * 1000 + 1000);

  }



  clearCooldowns() {

    this.cooldowns.clear();

  }



  async reloadCommands() {

    this.commands.clear();

    await this.loadCommands();

    logger.success(
      "Commands reloaded successfully"
    );

  }



  searchCommands(query) {

    if (!query)
      return [];


    return this.getAllCommands()
      .filter(name =>
        name.includes(
          query.toLowerCase()
        )
      );

  }



  getStats() {

    return {

      commands:
        this.getAllCommands().length,

      aliases:
        this.commands.size -
        this.getAllCommands().length,

      cooldowns:
        this.cooldowns.size,

      loadTime:
        this.loadTime

    };

  }

}


module.exports = CommandLoader;
