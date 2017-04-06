import commando = require('discord.js-commando');

module.exports = class AddRoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'addrole',
            group: 'joinableroles',
            description: 'Adds a role to the joinable roles.',
            memberName: 'addrole',
            args: [
                {
                    key: 'newRole',
                    prompt: 'what role would you like to add?',
                    type: 'role'
                }
            ],

            guildOnly: true
        })
    }

    hasPermission(message: commando.CommandMessage) {
        return message.author.id === message.guild.ownerID;
    }

    async run(message: commando.CommandMessage, args) {
        var joinableRoles = this.client.provider.get(message.guild, 'joinableRoles', null);
        if ([null, undefined].includes(joinableRoles)) {
            this.client.provider.set(message.guild, 'joinableRoles', []);
            joinableRoles = this.client.provider.get(message.guild, 'joinableRoles', null);
            message.reply("initialized joinable roles for " + message.guild.name + "!");
        }
            try {
                joinableRoles.push(args.newRole.id);
                this.client.provider.set(message.guild, 'joinableRoles', joinableRoles);
                return message.reply('added `' + args.newRole.name + "` to this guild's joinable roles!")
            }
            catch (e) {
                return message.reply("joinable roles data is invalid! :anger:");
            }
    }
}