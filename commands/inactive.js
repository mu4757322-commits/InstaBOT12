const fs = require("fs-extra");
const path = require("path");

const DB_PATH = path.join(
  __dirname,
  "../database/activity.json"
);


function getData() {

  if (!fs.existsSync(DB_PATH)) {
    fs.ensureFileSync(DB_PATH);
    fs.writeJsonSync(DB_PATH, {});
  }

  return fs.readJsonSync(DB_PATH);

}


function saveData(data) {
  fs.writeJsonSync(
    DB_PATH,
    data,
    { spaces: 2 }
  );
}


module.exports = {

  config: {
    name: "inactive",
    aliases: [
      "inactiveusers",
      "inactiveuser"
    ],
    description: "Check inactive group members",
    usage: "inactive [days]",
    cooldown: 10,
    role: 1,
    author: "Eren",
    category: "moderation"
  },


  async run({ api, event, args }) {

    try {


      const days =
        parseInt(args[0]) || 7;


      const data = getData();


      const limit =
        Date.now() -
        (days * 24 * 60 * 60 * 1000);



      let inactiveUsers =
        Object.values(data)
        .filter(user =>
          user.lastActive < limit
        );



      if (!inactiveUsers.length) {

        return api.sendMessage(
          `✅ No inactive users found.\n\nChecked: ${days} days`,
          event.threadID
        );

      }



      let msg =
`📊 INACTIVE MEMBERS

━━━━━━━━━━━━━━
`;



      inactiveUsers
      .slice(0, 20)
      .forEach((user, index)=>{


        const last =
          Math.floor(
            (Date.now() - user.lastActive)
            /
            86400000
          );


        msg +=
`${index + 1}. ${user.name}

⏳ Inactive:
${last} days ago

`;

      });



      msg +=
`━━━━━━━━━━━━━━

Total inactive:
${inactiveUsers.length}

Checked:
${days} days`;



      return api.sendMessage(
        msg,
        event.threadID
      );



    } catch(err) {


      console.error(
        "Inactive Error:",
        err
      );


      return api.sendMessage(
        "❌ Failed to check inactive members.",
        event.threadID
      );


    }

  },


  // Activity save function
  updateActivity(userID, name) {


    const data = getData();


    data[userID] = {

      name:
        name || "Unknown",

      lastActive:
        Date.now()

    };


    saveData(data);

  }

};
