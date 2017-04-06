import commando = require('discord.js-commando');

module.exports = class JoinRoleCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'joinrole',
            group: 'joinableroles',
            memberName: 'joinrole',
            description: 'Join a joinable role.',
            args: [
                {
                    key: 'targetRole',
                    prompt: 'what role would you like to join?',
                    type: 'role'
                }
            ],

            guildOnly: true
        })
    }

    async run (message: commando.CommandMessage, args) {
        var joinableRoles: string[] = this.client.provider.get(message.guild, 'joinableRoles', null)
        if ([null, undefined].includes(joinableRoles)) {
            return message.reply("there are no available roles to join.");
        }
        else {
            if (joinableRoles.includes(args.targetRole.id)) {
                message.member.addRole(args.targetRole).then(function () {
                    return message.reply("successfully joined `" + args.targetRole.name + "`!");
                    }).catch(function (reason) {
                    return message.reply("failed to join `" + args.targetRole.name + "!` :anger:");
                })
            }
            else {
                return message.reply("that role is not joinable! :anger:");
            }
        }
    }
}