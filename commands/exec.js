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
const { inspect } = require("util")
const process = require("child_process")
module.exports.run = async (client, message, args, command) => {
    message.channel.send(`:ok_hand: Executing code...`).then((msg) => {msg.delete({timeout: 5000})})

    process.exec(args.join(" "), (error, stdout) => {
        let response = (error || stdout)
        message.channel.send(response, {code: 'asciidoc', split: "\n"}).catch((err) => {
            message.channel.send(`\`\`\`${err}\`\`\``)
        })
    })
    return;
}
module.exports.help = {
    name: "exec",
    usage: `exec <code to evaluate>`,
    description: "Runs shell or cmd code",
    aliases: ["execute"],
    category: "administrator",
    args: true
}