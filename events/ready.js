const {
    client,
    settings,
    bot,
    Discord,
    User,
    ms,
    chart
} = require('../index.js');
const config = require("../config");
const fs = require("fs")
client.on('ready', async function() {
    console.log(`✔️  Logged in as ${client.user.tag}`)
    console.log(`✔️  Watching ${client.users.cache.size} users in ${client.guilds.cache.size} guild(s)`)
    client.user.setActivity(config.botActivity, {
        type: 'WATCHING'
    })
    
    fs.readdir("./emojis/", (err, files) => {
        if(err) console.log(err)
        files.forEach(f=> {
            client.guilds.cache.forEach(g=> {
                let emojis = g.emojis.cache.map(e => e.name)
                if(emojis.indexOf(f.split(".")[0]) === -1){
                    g.emojis.create(`./emojis/${f}`, f.split(".")[0])
                }
            })
        })
    })
});