"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commando = require('discord.js-commando');
const discord_js_commando_1 = require("discord.js-commando");
const gm = require('gm');
const logger = require('../../shardLogger.js');
const path = require('path');
const fs = require('fs');
module.exports = class welcomeCardTestCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'welctest',
            group: 'kud',
            memberName: 'welctest',
            description: 'KUD Welcome card test.'
        });
    }
    async run(message, args) {
        var client = this.client;
        // TO-DO URGENT: Fix so that we don't save the images, potentially writing to the same file by two diff commands!
        const image = path.join(__dirname, "kud-1.jpg");
        const imageFinal = path.join(__dirname, "kud-1-final.jpg");
        const font = path.join(__dirname, "font-helvetica.ttf");
        gm(image)
            .resize(400, 200)
            .font(font).fontSize(35)
            .fill('#FFFFFF')
            .drawText(17, 100, "Kindly United Dreams")
            .fontSize(17)
            .drawText(17, 150, "Welcome, Test User")
            .write(imageFinal, function (err) {
            if (err) {
                logger.error("Error occurred while creating a welcome card. " + err, client.shard.id);
                return;
            }
            return message.channel.sendFile(imageFinal).then(function () {
                fs.unlink(imageFinal);
            });
        });
    }
};
//# sourceMappingURL=welcomecard.js.map