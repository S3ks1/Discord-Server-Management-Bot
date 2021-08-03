const mongoose = require("mongoose")
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
    Commandchannel
} = require("../index")

client.on("message", async message => {

    let command
    let targs = message.content.slice(1).trim().split(/ +/g)
    let tcommandName = targs.shift().toLowerCase()
    if(tcommandName === "tlogs" && message.channel.type == "dm"){
        if(client.commands.has(tcommandName)){
            command = client.commands.get(tcommandName)
        }
        else{
            command = client.commands.get(client.aliases.get(tcommandName))
        }
        command.run(client, message, targs, command)
    }

    if(!message.guild) return
    Commandchannel.findOne({channelId: message.channel.id}).then((res) => {
        if(res === null) {
            return;
        }
        else{
            message.delete({timeout: 15000})
        }
    })
    if(message.author.bot) return;
    let xd = Guild.findOne({ guildId: message.guild.id}).then(async (res) => {
        //console.log("Check for guild")
        if(res === null){
            
            const guild = new Guild({
                guildId: message.guild.id,
                prefix: ".",
                embedColor: "#36393E"
            })
            res = guild
            message.embedColor = res.embedColor
            guild.save().then((a) => {
                User.findOne({ discordId: message.author.id }).then((result) => {
                    //console.log("guild")
                    if(result == null){
                        if(message.author.bot) return;
                        const user = new User({
                            discordId: message.author.id,
                            profilePoints:[]
                        })
                        //console.log("user,")
                        result = user
                        user.save().then((a) => {
                            if(result.profilePoints.length !== 0){
                                result.profilePoints.forEach(p=>{
                                    if(p.guildId == message.guild.id){
                                        let num = result.profilePoints[result.profilePoints.indexOf(p)].points
                                        if(message.author.bot) return;
                                        if(p.level*37 <= p.points){
                                            result.profilePoints[result.profilePoints.indexOf(p)] = {
                                                guildId: message.guild.id,
                                                points: 0,
                                                level: p.level+1,
                                                totalxp: p.totalxp
                                            }
                                            message.channel.send(`:arrow_up: ${message.author}, you leveled up to level ${p.level+1}! `).then((msg) => {
                                                setTimeout(() => {
                                                    msg.delete()
                                                }, 3700)
                                            })
                                            result.save()
                                            return;
                                        }
                                        result.profilePoints[result.profilePoints.indexOf(p)] = {
                                            guildId: message.guild.id,
                                            points: num+1,
                                            level: p.level,
                                            totalxp: totalxp+1
                                        }
                                        result.save()
                                    }
                                })
                            }
                            else{
                                User.updateOne({ discordId: message.author.id }, {
                                    $push: {
                                        profilePoints: {
                                            "guildId": message.guild.id,
                                            "points": 0,
                                            "level":1
                                        }
                                    }
                                }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
        
            
                            }
                        })
                    }
                    else{
                        if(result.profilePoints.length !== 0){
                            result.profilePoints.forEach(p=>{
                                if(p.guildId == message.guild.id){
                                    let num = result.profilePoints[result.profilePoints.indexOf(p)].points
                                    if(message.author.bot) return;
                                    if(p.level*37 <= p.points){
                                        result.profilePoints[result.profilePoints.indexOf(p)] = {
                                            guildId: message.guild.id,
                                            points: 0,
                                            level: p.level+1,
                                            totalxp: p.totalxp
                                        }
                                        message.channel.send(`:arrow_up: ${message.author}, you leveled up to level ${p.level+1}! `).then((msg) => {
                                            setTimeout(() => {
                                                msg.delete()
                                            }, 3700)
                                        })
                                        result.save()
                                        return;
                                    }
                                    result.profilePoints[result.profilePoints.indexOf(p)] = {
                                        guildId: message.guild.id,
                                        points: num+1,
                                        level: p.level,
                                        totalxp: totalxp+1
                                    }
                                    result.save()
                                }
                            })
                        }
                        else{
                            User.updateOne({ discordId: message.author.id }, {
                                $push: {
                                    profilePoints: {
                                        "guildId": message.guild.id,
                                        "points": 0,
                                        "level":1
                                    }
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
    
        
                        }
                    }
    
                })
                let prefix = res.prefix
            let command
            if(message.content.indexOf(prefix) !== 0) return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g)
            const commandName = args.shift().toLowerCase()
            //console.log(client.commands)
            if(client.commands.has(commandName)){
                command = client.commands.get(commandName)
            }
            else{
                command = client.commands.get(client.aliases.get(commandName))
            }

            if(cooldowns.has(message.author.id) && command && !message.member.hasPermission("ADMINISTRATOR")){
                let embed = new Discord.MessageEmbed().setDescription(`:warning: You are on command cooldown`).setColor(res.embedColor).setTimestamp()
                return message.channel.send(embed)
            }
            else{
                //console.log("got passed cooldown")
                cooldowns.add(message.author.id)
                setTimeout(() => {
                    cooldowns.delete(message.author.id)
                }, res.commandCooldown*1000)
                if(command) {
                    //console.log("Valid command")
                    Perms.findOne({ commandName: command.help.name }).then((lol) => {
                        if(lol === null){
                            const perm = new Perms({
                                commandName: command.help.name, 
                                roles: [],
                                users: [],
                                permissions: ["SEND_MESSAGES"]
                            })
                            perm.save().then((a) => {})
                        }
                        else{
                            let final = []

                            if(lol.roles.length !== 0){
                                lol.roles.forEach(r=>{
                                    if(message.member.roles.cache.has(r)){
                                        final.push("lol")
                                    }
                                })
                            }

                            if(lol.users.length !== 0){
                                lol.users.forEach(u=>{
                                    if(message.author.id === u){
                                        final.push("lol")
                                    }
                                })
                            }

                            if(lol.permissions.length !== 0){
                                lol.permissions.forEach(p=>{
                                    if(message.member.hasPermission(p)){
                                        final.push("lol")
                                    }
                                })
                            }
                            if(command.help.args === true && !args[0]){
                                let usagecmd = command
                                let users = []
                                let roles = []
                                let perm = []
                                lol.roles.forEach(r=>{
                                    roles.push(`<@&${r}>`)
                                })
                                lol.permissions.forEach(p =>{
                                    perm.push(`\`${p}\``)
                                })
                                lol.users.forEach(u=>{
                                    users.push(`<@!${u}>`)
                                })
                                let field = []
                                field.push(users.join(", "))
                                field.push(roles.join(", "))
                                field.push(permissions.join(", "))
                                if(usagecmd === undefined){
                                    let embed = new Discord.MessageEmbed().setColor(res.embedColor).setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                                        dynamic: true
                                    })).setDescription(`:x: **${args[0]}** is not a valid command`).setTimestamp();
                                    return message.channel.send(embed)
                                }
                                else{
                                    var alias;
                                    if(usagecmd.help.aliases.length < 1) { 
                                        alias = "No Aliases"
                                    }
                                    else{
                                        alias = usagecmd.help.aliases.join(", ")
                                    }
                                    let embed = new Discord.MessageEmbed().setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                                        dynamic: true
                                    })).addField("Command Name", usagecmd.help.name).addField("Usage", usagecmd.help.usage).addField("Description", usagecmd.help.description).addField("Category", usagecmd.help.category).addField("Aliases", adata).setColor(res.embedColor)
                                    if (field.length !== 0) {
                                        embed.addField("Permissions", field.join("\n"))
                                    }
                                    return message.channel.send(embed)

                                }
                            }
                            else if(final.length === 0){
                                let usagecmd = command
                                let embed = new Discord.MessageEmbed().setColor(res.embedColor).setDescription(`:warning: You don't have the required permissions to execute the ${usagecmd.help.name} command`).setTimestamp()
                                message.channel.send(embed)
                                return;
                            }
                            else{
                                command.run(client, message, args, command)
                            }
                        }
                    })
                }
            }
            })
            
        }
        else{
            client[message.guild.id] = {}
            client[message.guild.id].settings = res
            message.embedColor = res.embedColor
        let xd = await message.guild.members.fetch(message.author.id)

	    if(message.channel.id == "828037040167845938" && xd._roles.indexOf(message.guild.roles.cache.find(r => r.name === client[message.guild.id].settings.supportRole).id) == -1) return;
            //console.log("if there isg uild")
            User.findOne({ discordId: message.author.id }).then((result) => {
                if(result === null){
                    if(message.author.bot) return;
                    const user = new User({
                        discordId: message.author.id,
                        profilePoints:[],
                    })
                    result = user
                    //console.log("Null result if no guild and NO user")
                    user.save().then((a) => {
                        if(result.profilePoints.length !== 0){
                            result.profilePoints.forEach(p=>{
                                if(p.guildId == message.guild.id){
                                    let num = result.profilePoints[result.profilePoints.indexOf(p)].points
                                    if(message.author.bot) return;
                                    if(p.level*37 <= p.points){
                                        result.profilePoints[result.profilePoints.indexOf(p)] = {
                                            guildId: message.guild.id,
                                            points: 0,
                                            level: p.level+1,
                                            totalxp: p.totalxp
                                        }
                                        message.channel.send(`:arrow_up: ${message.author}, you leveled up to level ${p.level+1}! `).then((msg) => {
                                            setTimeout(() => {
                                                msg.delete()
                                            }, 3700)
                                        })
                                        result.save()
                                        return;
                                    }
                                    result.profilePoints[result.profilePoints.indexOf(p)] = {
                                        guildId: message.guild.id,
                                        points: num+1,
                                        level: p.level,
                                        totalxp: p.totalxp+1
                                    }
                                    result.save()
                                }
                            })
                        }
                        else{
                            User.updateOne({ discordId: message.author.id }, {
                                $push: {
                                    profilePoints: {
                                        "guildId": message.guild.id,
                                        "points": 0,
                                        "level":1
                                    }
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
    
        
                        }
                    })
                    
                }
                else{
                    if(result.profilePoints.length !== 0){
                        result.profilePoints.forEach(p=>{
                            if(p.guildId == message.guild.id){
                                let num = result.profilePoints[result.profilePoints.indexOf(p)].points
                                if(message.author.bot) return;
                                if(p.level*37 <= p.points){
                                    result.profilePoints[result.profilePoints.indexOf(p)] = {
                                        guildId: message.guild.id,
                                        points: 0,
                                        level: p.level+1,
                                        totalxp: p.totalxp
                                    }
                                    message.channel.send(`:arrow_up: ${message.author}, you leveled up to level ${p.level+1}! `).then((msg) => {
                                        setTimeout(() => {
                                            msg.delete()
                                        }, 3700)
                                    })
                                    result.save()
                                    return;
                                }
                                result.profilePoints[result.profilePoints.indexOf(p)] = {
                                    guildId: message.guild.id,
                                    points: num+1,
                                    level: p.level,
                                    totalxp: p.totalxp+1
                                }
                                result.save()
                            }
                        })
                    }
                    else{
                        User.updateOne({ discordId: message.author.id }, {
                            $push: {
                                profilePoints: {
                                    "guildId": message.guild.id,
                                    "points": 0,
                                    "level":1
                                }
                            }
                        }, {  safe: true, upsert: true}  ).then(a =>  {})

    
                    }
                }
                let prefix = res.prefix
            let command
            if(message.content.indexOf(prefix) !== 0) return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g)
            const commandName = args.shift().toLowerCase()
            //console.log(client.commands)
            if(client.commands.has(commandName)){
                command = client.commands.get(commandName)
            }
            else{
                command = client.commands.get(client.aliases.get(commandName))
            }

            if(cooldowns.has(message.author.id) && command && !message.member.hasPermission("ADMINISTRATOR")){
                let embed = new Discord.MessageEmbed().setDescription(`:warning: You are on command cooldown`).setColor(res.embedColor).setTimestamp()
                return message.channel.send(embed)
            }
            else{
                //console.log("got passed cooldown")
                cooldowns.add(message.author.id)
                setTimeout(() => {
                    cooldowns.delete(message.author.id)
                }, res.commandCooldown*1000)
                if(command) {
                    //console.log("Valid command")
                    Perms.findOne({ commandName: command.help.name }).then((lol) => {
                        if(lol === null){
                            const perm = new Perms({
                                commandName: command.help.name, 
                                roles: [],
                                users: [],
                                permissions: ["ADMINISTRATOR"]
                            })
                            perm.save().then((a) => {})
                        }
                        else{
                            let final = []

                            if(lol.roles.length !== 0){
                                lol.roles.forEach(r=>{
                                    if(message.member.roles.cache.has(r)){
                                        final.push("lol")
                                    }
                                })
                            }

                            if(lol.users.length !== 0){
                                lol.users.forEach(u=>{
                                    if(message.author.id === u){
                                        final.push("lol")
                                    }
                                })
                            }

                            if(lol.permissions.length !== 0){
                                lol.permissions.forEach(p=>{
                                    if(message.member.hasPermission(p)){
                                        final.push("lol")
                                    }
                                })
                            }
                            if(command.help.args === true && !args[0]){
                                let usagecmd = command
                                let users = []
                                let roles = []
                                let perm = []
                                lol.roles.forEach(r=>{
                                    roles.push(`<@&${r}>`)
                                })
                                lol.permissions.forEach(p =>{
                                    perm.push(`\`${p}\``)
                                })
                                lol.users.forEach(u=>{
                                    users.push(`<@!${u}>`)
                                })
                                let field = []
                                field.push(users.join(", "))
                                field.push(roles.join(", "))
                                field.push(perm.join(", "))
                                if(usagecmd === undefined){
                                    let embed = new Discord.MessageEmbed().setColor(res.embedColor).setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                                        dynamic: true
                                    })).setDescription(`:x: **${args[0]}** is not a valid command`).setTimestamp();
                                    return message.channel.send(embed)
                                }
                                else{
                                    var alias;
                                    if(usagecmd.help.aliases.length < 1) { 
                                        alias = "No Aliases"
                                    }
                                    else{
                                        alias = usagecmd.help.aliases.join(", ")
                                    }
                                    let embed = new Discord.MessageEmbed().setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                                        dynamic: true
                                    })).addField("Command Name", usagecmd.help.name).addField("Usage", usagecmd.help.usage).addField("Description", usagecmd.help.description).addField("Category", usagecmd.help.category).addField("Aliases", alias).setColor(res.embedColor)
                                    if (field.length !== 0) {
                                        embed.addField("Permissions", field.join("\n"))
                                    }
                                    return message.channel.send(embed)

                                }
                            }
                            else if(final.length === 0){
                                let usagecmd = command
                                let embed = new Discord.MessageEmbed().setColor(res.embedColor).setDescription(`:warning: You don't have the required permissions to execute the ${usagecmd.help.name} command`).setTimestamp()
                                message.channel.send(embed)
                                return;
                            }
                            else{
                                command.run(client, message, args, command)
                            }
                        }
                    })
                }
            }

            })
                    }

    })
})
