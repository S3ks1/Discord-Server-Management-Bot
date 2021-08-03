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

const { Collection } = require("discord.js")
const voiceCollection = new Collection()
var startTime;
var endTime;
client.on("voiceStateUpdate", async (oldState, newState) => {
    let newUserChannel = newState.channelID
    let oldUserChannel = oldState.channelID
  
    if (oldUserChannel === null && newUserChannel !== null) {
  
      function start() {
        client.vcTime.set(newState.id, {
            startTime: new Date(),
            endTime: null
        })
      }
      start();
  
    } else if(newUserChannel === null) {
        console.log(oldState)
  
      function end() {
        let z = client.vcTime.get(oldState.id);
        if(z !== undefined){
            client.vcTime.set(oldState.id, {
                startTime: z.startTime,
                endTime: new Date()
            })
            var timeDif = new Date() - z.startTime
            User.findOne({discordId:oldState.id}).then((res) => {
                if(res == null){
                    return;
                }
                else{
                    if(!res.vcTime == null){
                        res.vcTime = timeDif
                        console.log(timeDif)
                    }
                    else{
                        console.log(timeDif)
                        let placeholder = res.vcTime;
                        let add = placeholder+timeDif;
                        res.vcTime = add;
                        res.save()
                    }
                }
            })  
        }
        else{
            console.log("dumb nigga")
        }



      }
      end();
  
    }

    await Guild.findOne({ guildId: newState.guild.id}).then((res) => {
        let channel = newState.guild.channels.cache.find(c => c.name.toLowerCase() == res.privateVoiceChannel.toLowerCase())


        if(!channel) return console.log("No Channel");
        client.users.fetch(newState.id).then((user) => {
            const member = newState.guild.member(user)
            if(voiceCollection.get(newState.id) !== undefined && newState.channelID !== oldState.channelID){
                if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete().then((xd) => {
                    if(newState.channelID == channel.id){
                        member.voice.setChannel(null);
                    }
        
                    voiceCollection.delete(newState.id)
                })
                
            }
            else if(newState.channelID === channel.id && newState.channel){
                if(voiceCollection.get(newState.id)){
                    voiceCollection.delete(newState.id)
                }
                if(!voiceCollection.get(newState.id)){
                    let supportRole = newState.guild.roles.cache.find(r => r.name === res.supportRole)
                    if(!supportRole){
                        const channel = newState.guild.channels.create(`${user.username}'s voice channel`, {
                            type: "voice", 
                            parent: newState.channel.parent,
                            permissionOverwrites: [
                                {
                                    id: newState.guild.id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: newState.id,
                                    allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK", "USE_VAD", "STREAM"]
                                }
                            ]
                        }).then((c) => {
                            member.voice.setChannel(c)
                            voiceCollection.set(user.id, c.id)
                        })
                    }
                    else{
                        const channel = newState.guild.channels.create(`${user.username}'s voice channel`, {
                            type: "voice", 
                            parent: newState.channel.parent,
                            permissionOverwrites: [
                                {
                                    id: newState.guild.id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: newState.id,
                                    allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK", "USE_VAD", "STREAM"]
                                },
                                {
                                    id: supportRole.id,
                                    allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK", "USE_VAD", "STREAM"]
                                }
                            ]
                        }).then((c) => {
                            member.voice.setChannel(c)
                            voiceCollection.set(user.id, c.id)
                        })
                    }

                   

                }
                else{
                    
                    //newState.guild.channels.cache.get(voiceCollection.get(newState.id)).delete()
                    
                }
        
            }
            else if(!newState.channel){
                if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
                voiceCollection.delete(newState.id)
            }
        })
        
    }).catch((err) => {
        console.log(err)
    })
    setTimeout(() => {

    }, 500)
   

})