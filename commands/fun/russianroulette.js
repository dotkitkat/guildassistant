"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
module.exports = class RRCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'rr',
            aliases: ['russianroulette'],
            memberName: 'rr',
            group: 'fun',
            description: 'Russian Roulette. Wanna play, comrade?'
        });
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    async run(message, args) {
        const myint = this.getRandomInt(1, 7);
        if (myint == 6) {
            return message.reply(":skull_crossbones: You died.");
        }
        else {
            return message.reply("You didn't die!");
        }
    }
};
