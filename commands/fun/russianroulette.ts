import {Command, CommandoClient, CommandMessage} from "discord.js-commando";

module.exports = class RRCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'rr',
            aliases: ['russianroulette'],
            memberName: 'rr',
            group: 'fun',
            description: 'Russian Roulette. Wanna play, comrade?'
        })
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async run(message: CommandMessage, args) {
        const myint = this.getRandomInt(1, 7);
        if (myint == 6) {
            return message.reply(":skull_crossbones: You died.")
        }
        else {
            return message.reply("You didn't die!");
        }
    }
};