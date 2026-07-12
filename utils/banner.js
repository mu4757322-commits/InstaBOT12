const logger = require("./logger");
const config = require("../config");
const os = require("os");

class Banner {

    static display() {
        const version = config.BOT_VERSION || "1.0.0";

        console.clear();

        console.log(`
\x1b[1;36m
██╗███╗   ██╗███████╗████████╗ █████╗ ██████╗  ██████╗ ████████╗
██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝
██║██╔██╗ ██║███████╗   ██║   ███████║██████╔╝██║   ██║   ██║
██║██║╚██╗██║╚════██║   ██║   ██╔══██║██╔══██╗██║   ██║   ██║
██║██║ ╚████║███████║   ██║   ██║  ██║██████╔╝╚██████╔╝   ██║
╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝  ╚═════╝    ╚═╝
\x1b[0m

\x1b[1;35m══════════════════════════════════════════════\x1b[0m
\x1b[1;32m🤖 BOT       : InstaBOT\x1b[0m
\x1b[1;36m👨‍💻 CREATOR   : NeoKEX\x1b[0m
\x1b[1;33m📦 VERSION   : v${version}\x1b[0m
\x1b[1;34m⚡ PREFIX    : ${config.PREFIX}\x1b[0m
\x1b[1;35m🖥️ PLATFORM  : ${os.platform()}\x1b[0m
\x1b[1;31m🟢 NODE      : ${process.version}\x1b[0m
\x1b[1;35m══════════════════════════════════════════════\x1b[0m
`);
    }

    static startupMessage(userID, username, commandCount, eventCount) {
        const memory = process.memoryUsage();
        const ram = Math.round(memory.rss / 1024 / 1024);

        logger.success("InstaBOT started successfully");
        logger.info(`User: @${username || "Loading..."} (${userID || "Loading..."})`);
        logger.info(`Loaded ${commandCount} commands and ${eventCount} events`);
        logger.info(`Prefix: ${config.PREFIX}`);
        logger.info(`RAM Usage: ${ram} MB`);
        logger.success("Listening for messages...");
    }

    static commandExecuted(commandName, user, success = true) {
        try {
            if (logger.command) {
                logger.command(commandName, user, success);
            } else {
                logger.info(`Command ${commandName} executed by ${user} ${success ? "✅" : "❌"}`);
            }
        } catch (error) {
            logger.error(`Command log error: ${error.message}`);
        }
    }

    static messageReceived(from, preview) {
        if (config.LOG_LEVEL === "debug") {
            let previewStr = "";
            try {
                if (typeof preview === "string") {
                    previewStr = preview;
                } else if (preview === null || preview === undefined) {
                    previewStr = "";
                } else if (typeof preview === "object") {
                    previewStr = JSON.stringify(preview);
                } else {
                    previewStr = String(preview);
                }
            } catch (error) {
                previewStr = "[unable to display]";
            }

            const truncated = previewStr.length > 60 ? previewStr.substring(0, 60) + "..." : previewStr;
            logger.debug(`📩 Message from ${from}: ${truncated}`);
        }
    }

    static systemInfo() {
        const memory = process.memoryUsage();
        return {
            platform: os.platform(),
            architecture: os.arch(),
            node: process.version,
            ram: `${Math.round(memory.rss / 1024 / 1024)} MB`,
            uptime: `${Math.floor(process.uptime())} seconds`
        };
    }

    static error(context, error) {
        logger.error(`${context}: ${error?.message || error}`);
    }

    static info(message) {
        logger.info(message);
    }

    static warning(message) {
        logger.warn(message);
    }

    static success(message) {
        logger.success(message);
    }
}

module.e
  xports = Banner;
