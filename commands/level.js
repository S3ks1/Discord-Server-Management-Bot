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
const Canvas = require("canvas")
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 24;

	do {
		ctx.font = `${fontSize -= 2}px Verdana`;
	} while (ctx.measureText(text).width > canvas.width - 150);
	return ctx.font;
};
var cat = []
module.exports.run = async (client, message, msgargs, command) => {
    //console.log("Level.js ran nicely")
    let member = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", "")) || message.guild.member(message.author)
    await User.findOne({ discordId: member.id}).then((res) => {
        //console.log(res)
        if(res === null){
            //console.log("res was null in level.js")
            if(member.user.bot) return;
            const user = new User({
                discordId: member.id,
                profilePoints:[],
            })
            user.save().then((a) => {
                if(res.profilePoints.length !== 0){
                    res.profilePoints.forEach(p=>{
                        if(p.guildId == message.guild.id){
                            let num = res.profilePoints[res.profilePoints.indexOf(p)].points
                            if(member.bot) return;
                            if(p.level*37 <= p.points){
                                res.profilePoints[res.profilePoints.indexOf(p)] = {
                                    guildId: message.guild.id,
                                    points: 0,
                                    level: p.level+1,
                                    totalxp: p.totalxp
                                }
                                message.channel.send(`:arrow_up: ${member}, you leveled up to level ${p.level+1}! `).then((msg) => {
                                    setTimeout(() => {
                                        msg.delete()
                                    }, 3700)
                                })
                                res.save()
                                return;
                            }
                            res.profilePoints[res.profilePoints.indexOf(p)] = {
                                guildId: message.guild.id,
                                points: num+1,
                                level: p.level,
                                totalxp: p.totalxp+1
                            }
                            res.save()
                        }
                    })
                }
                else{
                    User.updateOne({ discordId: member.id }, {
                        $push: {
                            profilePoints: {
                                "guildId": message.guild.id,
                                "points": 0,
                                "level":1,
                                "totalxp":0
                            }
                        }
                    }, {  safe: true, upsert: true}  ).then(a => {})
                    let updated = res
                    updated.profilePoints.push({
                        guildId: message.guild.id,
                        points: 0,
                        level: 1,
                        totalxp: 0
                    })
                    //console.log("Test")
                    res.push({
                        guildId: message.guild.id,
                        points: 0,
                        level: 1,
                        totalxp: 0
                    })
                    //console.log(res)
                    res.profilePoints.forEach(p=>{
                        if(p.guildId == message.guild.id){
                            const canvas = Canvas.createCanvas(450, 150);
                            const ctx = canvas.getContext("2d")
                            ctx.fillStyle = "#2C2F33"
                            ctx.fillRect(0,0, canvas.width, canvas.height)
                            ctx.fillStyle = "#23272A"
                            ctx.strokeStyle = "#23272A"
                            ctx.lineJoin = "round"
                            ctx.lineWidth = 10
                            ctx.strokeRect(20, 20, (canvas.width-30)-10, (canvas.height-30)-10)
                            
                            ctx.fillRect(20,20, ((canvas.width-30))-10, ((canvas.height-30))-10)
                        
            
                            
                            ctx.beginPath()
                            ctx.lineWidth = 2
                            ctx.strokeStyle = "#7289DA"
                            ctx.globalAlpha = 0.2
                            ctx.fillStyle = "#23272A"
                            ctx.fillRect(75, 86, 350, 40)
                            ctx.fill()
                            ctx.globalAlpha = 1
                            ctx.strokeRect(75, 86, 350, 40)
                            ctx.stroke()
            
                            ctx.fillStyle = "#0099ff"
                            ctx.globalAlpha = 0.4
                            ctx.fillRect(75, 86, ((100/ (p.level*37) * p.points) * 3.5), 40)
            
                            ctx.globalAlpha = 1
                            ctx.beginPath();
                            ctx.arc(75, 75, 51, 0, 2 * Math.PI)
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = "#000000"
                            ctx.stroke()
                        
                            
                            ctx.globalAlpha = 1
                            ctx.fillStyle = '#FFFFFF';
                            ctx.font = "14px Courier New"
                            let pepe = `Level ${p.level}`
                            let xp = `${p.points} / ${p.level*37} xp`
                            let name = `${member.user.tag}`
                            let z = ctx.measureText(name).width
                            let l = ctx.measureText(pepe).width
                            let c = ctx.measureText(xp).width
                            //console.log(l)
                            ctx.fillText(name, canvas.width-23-z, canvas.height*0.2)
                            ctx.fillText(`Level ${p.level}`, canvas.width-23-l, canvas.height *0.3);
            
                            ctx.fillText(`${p.points} / ${p.level*37} xp`, canvas.width-23-c, canvas.height *0.4)
            
            
                            ctx.shadowColor = "black";
                            const avatar = Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg'})).then((done) => {
                                ctx.globalAlpha = 1
                                ctx.fillStyle = "#7289DA"
                                ctx.strokeStyle = "#7289DA"
                                ctx.beginPath();
                                ctx.arc(75, 75, 50, 0, 2 * Math.PI);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(done, 25, 25, 100, 100);
                        
                                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png")
                                    message.channel.send(attachment)
                            })
            
                        }
                    })

                }
            })
            return;
        }
        if(res.profilePoints.length == 0){
        let updated = res
        updated.profilePoints.push({
            guildId: message.guild.id,
            points: 0,
            level: 1,
            totalxp: 0
        })
        res = updated
        //console.log(res)
    }
        res.profilePoints.forEach(p=>{
            //console.log(p)
            if(p.guildId == message.guild.id){
                const canvas = Canvas.createCanvas(450, 150);
                const ctx = canvas.getContext("2d")
                ctx.fillStyle = "#2C2F33"
                ctx.fillRect(0,0, canvas.width, canvas.height)
                ctx.fillStyle = "#23272A"
                ctx.strokeStyle = "#23272A"
                ctx.lineJoin = "round"
                ctx.lineWidth = 10
                ctx.strokeRect(20, 20, (canvas.width-30)-10, (canvas.height-30)-10)
                
                ctx.fillRect(20,20, ((canvas.width-30))-10, ((canvas.height-30))-10)
            

                
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.strokeStyle = "#7289DA"
                ctx.globalAlpha = 0.2
                ctx.fillStyle = "#23272A"
                ctx.fillRect(75, 86, 350, 40)
                ctx.fill()
                ctx.globalAlpha = 1
                ctx.strokeRect(75, 86, 350, 40)
                ctx.stroke()

                ctx.fillStyle = "#0099ff"
                ctx.globalAlpha = 0.4
                ctx.fillRect(75, 86, ((100/ (p.level*37) * p.points) * 3.5), 40)

                ctx.globalAlpha = 1
                ctx.beginPath();
                ctx.arc(75, 75, 51, 0, 2 * Math.PI)
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000000"
                ctx.stroke()
            
                
                ctx.globalAlpha = 1
                ctx.fillStyle = '#FFFFFF';
                ctx.font = "bold 18px Verdana"
                let pepe = `Level ${p.level}`
                let xp = `${p.points} / ${p.level*37} xp`
                let name = `${member.user.tag}`
                let z = ctx.measureText(name).width
                let l = ctx.measureText(pepe).width
                let c = ctx.measureText(xp).width
                //console.log(l)
                ctx.fillText(name, canvas.width-23-z, canvas.height*0.225)
                ctx.fillText(`Level ${p.level}`, canvas.width-23-l, canvas.height *0.35);

                ctx.fillText(`${p.points} / ${p.level*37} xp`, canvas.width-23-c, canvas.height *0.475)


                ctx.shadowColor = "black";
                const avatar = Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg'})).then((done) => {
                    ctx.globalAlpha = 1
                    ctx.fillStyle = "#7289DA"
                    ctx.strokeStyle = "#7289DA"
                    ctx.beginPath();
                    ctx.arc(75, 75, 50, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(done, 25, 25, 100, 100);
            
                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png")
                        message.channel.send(attachment)
                })

            }
        })
    })
    
}
module.exports.help = {
    name: "level",
    usage: `level [user]`,
    description: "Shows user level",
    aliases: ["rank"],
    category: "general",
    args: false
}