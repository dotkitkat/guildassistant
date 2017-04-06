import commando = require('discord.js-commando');
import discord = require('discord.js')

module.exports = class AnnounceCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'announce',
            group: 'kud',
            memberName: 'announce',
            description: 'Creates an annoucement'
        })
    }

    hasPermission(message: commando.CommandMessage) {
        return (message.guild.channels.get("258570586899480586")).permissionsFor(message.member).hasPermission('SEND_MESSAGES');
    }
    
    async run(message: commando.CommandMessage, arg) {
        var emb: discord.RichEmbed = new discord.RichEmbed();
        emb.setTitle("Announcement");
        emb.setDescription(arg);
        emb.addField("Announcer", message.author, true);
        var d = Date.now();
        emb.addField("Timestamp", (new Date().toUTCString()), true);
        return (message.guild.channels.get("258570586899480586") as discord.TextChannel).sendEmbed(emb);
    }
}