const {
    client,
    cooldowns,
    Discord,
    fs,
    ms,
    moment,
    config,
    User,
    Guild,
    Ticket,
    Perms
} = require("../index") 
const Rcon = require('modern-rcon');

const rcon = new Rcon('chargeddev.cloud', 'rconpassword');
 

module.exports.run = async (client, message, msgargs, command) => {
    rcon.connect().then(() => {
      return rcon.send(msgargs.join(" ")); // That's a command for Minecraft
    }).then(res => {
      message.channel.send(res);
    }).then(() => {
      return rcon.disconnect();
    });

}
module.exports.help = {
    name: "cmd",
    description: "Run an ingame command through console",
    usage: `cmd <command>`,
    aliases: ["command", "runcmd"],
    category: "administrator",
    args: true
}