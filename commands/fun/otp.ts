import {Command, CommandoClient} from "discord.js-commando";
import {Guild, GuildMember} from "discord.js";

module.exports = class OTPCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'otp',
            description: 'One True Pairing.',
            memberName: 'otp',
            group: 'fun',
            guildOnly: true
        })
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async run(message, args) {
        const guild: Guild = message.guild;
        const guildTarget = this.getRandomInt(1, guild.memberCount);
        const guildTarget2 = this.getRandomInt(1, guild.memberCount);
        return message.reply(":heart_decoration: **" + guild.members.array()[guildTarget].displayName + "** x **" + guild.members.array()[guildTarget2].displayName + "** :heart_decoration:");
    }
};