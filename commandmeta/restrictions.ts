import commando = require('discord.js-commando');
import discord = require('discord.js');

export default class Restrictions {
    static shardOnlyCommand(message: discord.Message, command: commando.CommandMessage): boolean {
        return !(command.client.shard.id === null);
    }
    
    static ownerOnlyCommand(message: commando.CommandMessage): boolean {
        return message.command.client.isOwner(message.author.id);
    }
}