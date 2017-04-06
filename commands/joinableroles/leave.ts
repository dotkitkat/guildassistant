import commando = require('discord.js-commando')
import discord = require('discord.js');

module.exports = class LeaveRoleCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'leaverole',
            memberName: 'leaverole',
            description: 'Leaves a role.',
            group: 'joinableroles',
            guildOnly: true,
            args: [
                {
                    key: 'leaving',
                    label: 'role',
                    type: 'role',
                    prompt: 'what role would you like to leave?'
                }
            ]
        })
    }

    async run(message: commando.CommandMessage, args) {
        var leaving: discord.Role = args.leaving;
        var joinableRoles: string[] = this.client.provider.get(message.guild, 'joinableRoles', null);
        if ([null, undefined].includes(joinableRoles)) {
            return message.reply("there are no joinable roles.")
        }
        if (message.member.roles.has(leaving.id)) {
            if (joinableRoles.includes(leaving.id)) {
                message.member.removeRole(leaving).then(function (gm: discord.GuildMember) {
                    return message.reply("successfully left `" + leaving.name + "`.");
                }).catch(function (reason) {
                    return message.reply("failed to leave `" + leaving.name + "`.");
                })
            }
            else {
                return message.reply("that role is not a joinable role! :anger:");
            }
        }
        else {
            return message.reply("you are not a member of this role! :anger:");
        }
    }
}