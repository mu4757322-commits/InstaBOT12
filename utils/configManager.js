const fs = require("fs");
const path = require("path");
const logger = require("./logger");

class ConfigManager {

  static configPath = path.resolve(
    __dirname,
    "../config/default.json"
  );

  static cache = null;


  static ensureFile() {

    const dir = path.dirname(
      this.configPath
    );


    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
    }


    if (!fs.existsSync(this.configPath)) {

      fs.writeFileSync(
        this.configPath,
        JSON.stringify({}, null, 2)
      );

    }

  }



  static loadConfig(force = false) {

    try {

      this.ensureFile();


      if (this.cache && !force) {
        return this.cache;
      }


      const data = fs.readFileSync(
        this.configPath,
        "utf-8"
      );


      this.cache = JSON.parse(data || "{}");


      return this.cache;


    } catch(error) {

      logger.error(
        "Config loading error",
        {
          error: error.message
        }
      );

      this.cache = {};

      return {};

    }

  }




  static saveConfig(config) {

    try {

      this.ensureFile();


      fs.writeFileSync(
        this.configPath,
        JSON.stringify(config, null, 2),
        "utf-8"
      );


      this.cache = config;


      logger.info(
        "Configuration saved successfully"
      );


      return true;


    } catch(error) {


      logger.error(
        "Config saving error",
        {
          error: error.message
        }
      );


      return false;

    }

  }




  static reload() {

    this.cache = null;

    return this.loadConfig(true);

  }



  // OWNER / DEV


  static getDevUsers() {

    return this.loadConfig()
      .devUsers || [];

  }



  static isDev(id) {

    return this.getDevUsers()
      .includes(String(id));

  }



  static getDeveloper() {

    return this.getDevUsers()[0] || "";

  }



  // ADMINS


  static getAdmins() {

    return this.loadConfig()
      .adminBot || [];

  }



  static isAdmin(id) {

    return this.getAdmins()
      .includes(String(id));

  }



  static addAdmin(id) {

    const config =
      this.loadConfig();


    if (!config.adminBot)
      config.adminBot = [];


    id = String(id);


    if (
      config.adminBot.includes(id)
    )
      return false;


    config.adminBot.push(id);


    return this.saveConfig(config);

  }




  static removeAdmin(id) {

    const config =
      this.loadConfig();


    if (!config.adminBot)
      return false;


    id = String(id);


    config.adminBot =
      config.adminBot.filter(
        x => x !== id
      );


    return this.saveConfig(config);

  }




  // PREMIUM


  static getPremiumUsers() {

    return this.loadConfig()
      .premiumUsers || [];

  }



  static isPremium(id) {

    return this.getPremiumUsers()
      .includes(String(id));

  }




  static addPremiumUser(id) {

    const config =
      this.loadConfig();


    if (!config.premiumUsers)
      config.premiumUsers = [];


    id = String(id);


    if (
      config.premiumUsers.includes(id)
    )
      return false;


    config.premiumUsers.push(id);


    return this.saveConfig(config);

  }





  static removePremiumUser(id) {

    const config =
      this.loadConfig();


    if (!config.premiumUsers)
      return false;


    id = String(id);


    config.premiumUsers =
      config.premiumUsers.filter(
        x => x !== id
      );


    return this.saveConfig(config);

  }




  // PREFIX


  static getPrefix() {

    return (
      this.loadConfig().PREFIX ||
      process.env.PREFIX ||
      "?"
    );

  }




  static setPrefix(prefix) {

    const config =
      this.loadConfig();


    config.PREFIX = prefix;


    return this.saveConfig(config);

  }




  // BOT SETTINGS


  static get(key, fallback = null) {

    return (
      this.loadConfig()[key] ??
      fallback
    );

  }




  static set(key,value) {

    const config =
      this.loadConfig();


    config[key] = value;


    return this.saveConfig(config);

  }




  static backup() {

    try {

      const backup =
        this.configPath + ".backup";


      fs.copyFileSync(
        this.configPath,
        backup
      );


      return backup;


    } catch(error) {

      logger.error(
        "Backup failed",
        {
          error:error.message
        }
      );

      return null;

    }

  }

}


module.exports = ConfigManager;
