import commando = require('discord.js-commando');
import discord = require('discord.js');

module.exports = class VoteCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'votestart',
            memberName: 'votestart',
            description: 'Starts a vote.',
            group: 'guild',
            args: [
                {
                    key: 'time',
                    type: 'integer',
                    prompt: 'how long (in minutes) would you like the vote to run for?',
                    label: 'vote time'
                }
            ],
            guildOnly: true
        })
    }

    async run(message: commando.CommandMessage, args): Promise<any> {
        message.channel.sendMessage(`Starting a vote in \`${(message.channel as discord.TextChannel).name}\`.! Vote author: ${message.member.displayName}. Maximum time: ${args.time} minutes.`);
        message.channel.sendMessage(`Vote started. Vote with \`vote\``);
        var votes = 0;
        var usersVotes: discord.GuildMember[] = [];
        var col: discord.MessageCollector = new discord.MessageCollector(message.channel, x => x.content.startsWith(this.client.provider.get(message.guild, "prefix", this.client.provider.get('global', 'prefix')) + "vote"), {
            time: (args.time * 60000)
        })
        col.on('message', function (message: discord.Message, collector: discord.MessageCollector) {
            if (!usersVotes.includes(message.member)) {
                votes++;
                usersVotes.push(message.member);
                message.reply("you have successfully voted!");
            }
            else {
                message.reply("you have already voted!");
            }
        });
        col.on('end', function (m: discord.Collection<string, discord.Message>) {
            return message.reply("the votes are in! " + m.size + " users have voted!");
        })
    }
}