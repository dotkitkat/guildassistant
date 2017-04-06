import commando = require('discord.js-commando');
import discord = require('discord.js');

module.exports = class JoinRoleCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'listroles',
            group: 'joinableroles',
            memberName: 'listroles',
            description: 'Lists all joinable roles.',

            guildOnly: true
        })
    }

    async run (message: commando.CommandMessage, args) {
        var cl: commando.CommandoClient = this.client;
        var joinableRoles: string[] = this.client.provider.get(message.guild, 'joinableRoles', null)
        var emb: discord.RichEmbed = new discord.RichEmbed();
        emb.setTitle("Available Roles");
        emb.setDescription("Available roles to join:\n");
        var roles: string[] = [];
        if ([null, undefined].includes(joinableRoles)) {
            emb.setDescription(emb.description + "There are no available roles to join. \n");
            return message.replyEmbed(emb);
        }
        else {
            joinableRoles.forEach(function (val) {
                if (message.guild.roles.has(val)) {
                    emb.setDescription(emb.description + message.guild.roles.get(val).name + "\n");
                }
            })
            return message.replyEmbed(emb);
        }
    }
}