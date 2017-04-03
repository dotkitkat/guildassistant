"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
module.exports = class OTPCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'otp',
            description: 'One True Pairing.',
            memberName: 'otp',
            group: 'fun',
            guildOnly: true
        });
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    async run(message, args) {
        const guild = message.guild;
        const guildTarget = this.getRandomInt(1, guild.memberCount);
        const guildTarget2 = this.getRandomInt(1, guild.memberCount);
        return message.reply(":heart_decoration: **" + guild.members.array()[guildTarget].displayName + "** x **" + guild.members.array()[guildTarget2].displayName + "** :heart_decoration:");
    }
};
