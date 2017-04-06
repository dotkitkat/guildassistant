import commando = require('discord.js-commando');
import discord = require('discord.js');

module.exports = class DeleteRoleCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'deleterole',
            group: 'joinableroles',
            memberName: 'deleterole',
            description: 'Deletes a role.',
            args: [
                {
                    key: 'target',
                    label: 'role',
                    prompt: 'what role would you like to delete?',
                    type: 'role'
                }
            ]
        })
    }

    hasPermission(message: commando.CommandMessage): boolean {
        return message.author.id === message.guild.ownerID;
    }

    async run(message: commando.CommandMessage, args) {
        var role: discord.Role = args.target;
        var client: commando.CommandoClient = this.client;
        var joinableRoles: string[] = this.client.provider.get(message.guild, 'joinableRoles', null);
        if ([null, undefined].includes(joinableRoles)) {
            return message.reply("there are no joinable roles to delete! :anger:");
        }
        else {
            if (joinableRoles.includes(role.id)) {
                var newJoinableRoles = joinableRoles.filter(function (roleId) {
                    return roleId != role.id
                })
                client.provider.set(message.guild, 'joinableRoles', newJoinableRoles).then(function () {
                    return message.reply("successfully removed `" + role.name + "` from `" + role.guild.name + "`'s joinable roles!");
                })
            }
            else {
                return message.reply("that is not a joinable role!");
            }
        }
    }
}