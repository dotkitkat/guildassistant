module.exports = class shardLogger {
    static shardLog(toLog: string, shardId: number) {
        if (shardId === undefined && !(require('./config.json')["devEnvironment"])) {
            console.log(`[Shard Unknown] ${toLog}`)
        }
        else if (shardId === undefined && require('./config.json')["devEnvironment"]) {
            console.log(`[Client] ${toLog}`)
        }
    }

    static shardError(toLog: string, shardId: number) {
        this.shardLog("[Error] " + toLog, shardId);
    }

    static bootloaderLog(toLog: string) {
        console.log(`[Azure Bootloader] ${toLog}`);
    }

    static shardManagerLog(toLog: string) {
        console.log(`[Sharding Manager] ${toLog}`);
    }
};