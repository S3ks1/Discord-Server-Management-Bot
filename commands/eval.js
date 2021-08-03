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
    Perms, 
    Case
} = require("../index") 
const { inspect } = require("util")
module.exports.run = async (client, message, msgargs, command) => {
    const code = msgargs.join(" ")
    try{
        const result = await eval(code)
        let output = result
        if(typeof result !== 'string'){
            output = inspect(result)
        }
        message.channel.send(`\`\`\`${output}\`\`\``)
    }
    catch(err) {
        message.channel.send(`:warning: ${err}`)
    }
}
module.exports.help = {
    name: "eval",
    usage: `eval <code to evaluate>`,
    description: "Evals code",
    aliases: ["e"],
    category: "administrator",
    args: true
}