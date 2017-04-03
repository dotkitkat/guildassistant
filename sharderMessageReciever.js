const shardingMan = require('discord.js').ShardingManager;

module.exports = function setupMessageRecieving(shardingManager, callback) {
    /*if (typeof(shardingManager) !== shardingMan) {
     throw new Error('An invalid sharding manager was supplied.');
     }*/
    // TypeScript won't compile if 'message' is not 'launch', hence why I'm doing it in a JavaScript file.
    shardingManager.on('message', callback);
};