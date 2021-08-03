const Discord = module.require("discord.js")
const fs = module.require("fs")
const config = module.require("./../config")
const moment = module.require("moment")
const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};
module.exports.run = async (client, message, msgargs, command) => {
    if (message.channel.type == "dm") return;
    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
    const members = message.guild.members.cache;
    const channels = message.guild.channels.cache;
    const emojis = message.guild.emojis.cache;
    const embed = new Discord.MessageEmbed().setDescription(`**Server information for __${message.guild.name}__**`).setThumbnail(message.guild.iconURL({
        dynamic: true
    })).setColor(message.embedColor).addField('General', [`**Name:** ${message.guild.name}`, `**Location:** ${regions[message.guild.region]}`, `**Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`, `**Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`, `**Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`, '\u200b']).addField('Statistics', [`**Role Count:** ${roles.length}`, `**Emoji Count:** ${emojis.size}`, `**Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`, `**Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`, `**Member Count:** ${message.guild.memberCount}`, `**Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`, `**Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`, `**Number of boosts:** ${message.guild.premiumSubscriptionCount || '0'}`, `**Roles:** ${message.guild.roles.cache.size > 20 ? "Too large to display" : message.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r)}`, '\u200b']).setTimestamp()
    message.channel.send(embed);
}
module.exports.help = {
    name: "serverinfo",
    usage: `${config.prefix}serverinfo`,
    description: "Shows detailed info about the current guild",
    aliases: ["guildinfo", "sinfo", "ginfo"],
    category: "general",
    args: false
}