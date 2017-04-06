module.exports = class shardLogger {
    static shardLog(toLog: string, shardId?: number) {
        if ([null, undefined].includes(shardId) && !(require('./config.json')["devEnvironment"])) {
            console.log(`[Shard Unknown] ${toLog}`)
        }
        else if ([null, undefined].includes(shardId) && require('./config.json')["devEnvironment"]) {
            console.log(`[Client] ${toLog}`)
        }
        else {
            console.log(`[Shard ${shardId}] ${toLog}`);
        }
    }

    static shardError(toLog: string, shardId?: number) {
        this.shardLog("[Error] " + toLog, shardId);
    }

    static bootloaderLog(toLog: string) {
        console.log(`[Azure Bootloader] ${toLog}`);
    }

    static shardManagerLog(toLog: string) {
        console.log(`[Sharding Manager] ${toLog}`);
    }
};