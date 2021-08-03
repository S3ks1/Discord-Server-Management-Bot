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

	let fontSize = 40;

	do {
		ctx.font = `${fontSize -= 10}px Verdana`;
	} while (ctx.measureText(text).width > canvas.width - 150);
	return ctx.font;
};


client.on('guildMemberAdd', async member => {
    Guild.findOne({ guildId: member.guild.id}).then(async (res) => {
        //console.log("Check for guild")
        if(res === null){}
        else{
            User.findOne({discordId: member.id}).then((res) => {
                if(res.muted === true){
                    let muterole = member.guild.roles.cache.find(muterole => muterole.name === "Muted");
                    member.roles.add(muterole.id)
                }
            })
            client[member.guild.id] = {}
            client[member.guild.id].settings = res
            member.settings = client[member.guild.id].settings
            let channel = member.guild.channels.cache.find(c=> c.name.toLowerCase() === client[member.guild.id].settings.logChannel.toLowerCase())
            let role = member.guild.roles.cache.find(r=> r.name.toLowerCase() === client[member.guild.id].settings.defaultRole.toLowerCase())
            
            if(channel){
                const dirs = fs.readdirSync("./images")
                var file = dirs[Math.floor(Math.random() * dirs.length)];
                const canvas = Canvas.createCanvas(700,250);
                const ctx = canvas.getContext("2d")
        
                const background = await Canvas.loadImage(`./images/${file}`)
                    ctx.drawImage(background, 0, 0, canvas.width +2 , canvas.height+2)
                ctx.shadowColor = "black";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 6;
                ctx.shadowOffsetY = 6;
                ctx.textAlign = 'center';
            
                ctx.font = applyText(canvas, `${member.user.tag} to ${member.guild.name}`);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${member.user.tag} to ${member.guild.name}`, canvas.width * 0.5, canvas.height *0.7);
                ctx.shadowColor = "black";
                ctx.font = applyText(canvas, `Welcome`);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Welcome`, canvas.width * 0.5, canvas.height *0.55);
                ctx.shadowColor = "black";
                ctx.font = applyText(canvas, `You are the ${member.guild.memberCount} Member`);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Member #${member.guild.memberCount}`, canvas.width * 0.5, canvas.height *0.85);
                ctx.shadowColor = "black";
                ctx.beginPath();
                ctx.arc(350, 55, 50, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.shadowColor = "black";
                const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg'}))
                ctx.drawImage(avatar, 300, 5, 100, 100);
                ctx.shadowColor = "black";
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png")
                channel.send(attachment)
                
        
                
            }
            if(role){
                member.roles.add(role)
            }
       
        }
    })

            


    
});