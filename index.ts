const secret = require('./config.json');
const express = require('express');
import discord = require('discord.js');
const pckg_inf = require("./package.json");

function bootloaderLog(toLog: string) {
    console.log(`[Azure Bootloader] ${toLog}`);
}

function shardManagerLog(toLog: string) {
    console.log(`[Shard Manager] ${toLog}`);
}

console.log(
    "  ____  _____  __ __  ____     ___\n" +
    " /    T|     T|  T  T|    \   /  _]\n" +
    "Y  o  |l__/  ||  |  ||  D  ) /  [_\n" +
    "|     ||   __j|  |  ||    / Y    _]\n" +
    "|  _  ||  /  ||  :  ||    \ |   [_\n" +
    "|  |  ||     |l     ||  .  Y|     T\n" +
    "l__j__jl_____j \__,_jl__j\_jl_____j\n");
bootloaderLog("Starting Sharding Manager....");


// Change this to an integer if you want custom shards.
var total_shards = null;

var sharder: discord.ShardingManager;

if (total_shards == null) {
    sharder = new discord.ShardingManager('shard.js', {
        respawn: true,
        token: secret.authToken
    })
}
else {
    sharder = new discord.ShardingManager('shard.js', {
        respawn: true,
        token: secret.authToken,
        totalShards: total_shards
    })
}

let masterServer = express();
masterServer.get('/shards', function (req, res) {
    var shards = {
        "global": {
            "version": pckg_inf.version,
            "author": pckg_inf.author,
            "shard_count": sharder.totalShards
        },
        "allShards": []
    };
    sharder.shards.array().forEach(function (item: discord.Shard, index) {
        shards["allShards"].push({
            "id": item.id,
            "connection_port": secret.shardServersBasePort + item.id
        });
    });
    return res.send(shards);
});

// the only reason the log is outside of the callback is so that is shows before the launching message for the first shard
shardManagerLog("Global API now listening on port " + secret.masterServerPort + ".");
masterServer.listen(secret.masterServerPort);

sharder.on('launch', shard => shardManagerLog(`Launching shard ${shard.id}. Total shards launched: ${sharder.shards.size}. Shards remaining: ${sharder.totalShards - sharder.shards.size}`));

sharder.spawn(this.totalShards);