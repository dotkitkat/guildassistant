import commando = require('discord.js-commando');
import commandSettings from './commandsettings.js';
import discord = require('discord.js');

export default class CustomCommand extends commando.Command {
    constructor(client: commando.CommandoClient, info: commando.CommandInfo, custom: commandSettings) {
        super(client, info);
        if (custom.ownerOnly) {
            this.hasPermission = function (message: commando.CommandMessage) {
                var a: boolean = true;
                if (custom.shardOnly) {
                    a = !(message.client.shard === null)
                }
                var b: boolean = message.command.client.isOwner(message.author.id);
                if (a && b) return true;
                else return false;
            }
        }
    }
}