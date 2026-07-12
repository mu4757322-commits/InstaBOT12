const ConfigManager = require("./configManager");
const logger = require("./logger");

class PermissionManager {

  static roleCache = new Map();
  static cacheTime = 60000;


  static getId(userId) {
    return String(userId || "");
  }


  static isGroupAdmin(userId, threadInfo = null) {
    try {
      if (!threadInfo) return false;

      const uid = this.getId(userId);


      const adminLists = [
        threadInfo.adminIDs,
        threadInfo.adminParticipants,
        threadInfo.admins
      ];


      for (const list of adminLists) {

        if (!Array.isArray(list)) continue;


        if (
          list.some(admin => {

            if (typeof admin === "object") {
              return this.getId(
                admin.uid ||
                admin.id ||
                admin.userID
              ) === uid;
            }

            return this.getId(admin) === uid;

          })
        ) {
          return true;
        }

      }


      return false;


    } catch (e) {

      logger.error(
        "Group admin check error",
        { error: e.message }
      );

      return false;
    }
  }



  static getGlobalRole(userId) {

    const uid = this.getId(userId);


    const cached = this.roleCache.get(uid);


    if (
      cached &&
      Date.now() - cached.time < this.cacheTime
    ) {
      return cached.role;
    }



    let role = 0;


    try {

      if (
        ConfigManager.getDevUsers()
        .includes(uid)
      ) {
        role = 4;
      }


      else if (
        ConfigManager.getAdmins()
        .includes(uid)
      ) {
        role = 2;
      }


      else if (
        ConfigManager.getPremiumUsers()
        .includes(uid)
      ) {
        role = 3;
      }



      this.roleCache.set(uid,{
        role,
        time: Date.now()
      });


    } catch(error){

      logger.error(
        "Role loading error",
        {error:error.message}
      );

    }


    return role;
  }



  static getUserRole(
    userId,
    threadInfo = null
  ){

    const global =
      this.getGlobalRole(userId);


    if(global !== 0)
      return global;


    if(
      this.isGroupAdmin(
        userId,
        threadInfo
      )
    ){
      return 1;
    }


    return 0;

  }




  static async hasPermission(
    userId,
    requiredRole = 0,
    threadInfo = null
  ){

    try {


      if(requiredRole <= 0)
        return true;



      const userRole =
        this.getUserRole(
          userId,
          threadInfo
        );



      if(userRole >= requiredRole)
        return true;



      return false;



    } catch(error){

      logger.error(
        "Permission check failed",
        {error:error.message}
      );

      return false;

    }

  }




  static checkPermission(
    userId,
    requiredRole,
    threadInfo=null
  ){

    const role =
      this.getUserRole(
        userId,
        threadInfo
      );


    return {

      allowed:
        role >= requiredRole,


      userRole:
        role,


      requiredRole,


      roleName:
        this.getRoleName(role)

    };

  }




  static getRoleName(role){

    const roles={

      0:"Normal User",

      1:"Group Admin",

      2:"Bot Admin",

      3:"Premium User",

      4:"Developer"

    };


    return roles[role] || "Unknown";

  }





  static getRoleEmoji(role){

    return {

      0:"👤",

      1:"👮",

      2:"🛡️",

      3:"⭐",

      4:"👑"

    }[role] || "❓";

  }





  static canUseNoPrefix(userId){

    const role =
      this.getGlobalRole(userId);


    return (
      role === 2 ||
      role === 4
    );

  }





  static isDeveloper(userId){

    return (
      this.getGlobalRole(userId) === 4
    );

  }





  static isAdmin(userId){

    const role =
      this.getGlobalRole(userId);


    return (
      role === 2 ||
      role === 4
    );

  }





  static isPremium(userId){

    const role =
      this.getGlobalRole(userId);


    return (
      role === 3 ||
      role === 2 ||
      role === 4
    );

  }





  static clearCache(){

    this.roleCache.clear();

  }




  static getRoleList(){

    return {

      0:"Normal User",

      1:"Group Admin",

      2:"Bot Admin",

      3:"Premium User",

      4:"Developer"

    };

  }

}


module.exports = PermissionManager;
