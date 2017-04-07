import commando = require('discord.js-commando')
import discord = require('discord.js')
const config = require('../../config.json');
const nani = require('nani').init(config.anilistApiId, config.anilistApiSecret);

module.exports = class StreamCreateCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'stream',
            memberName: 'stream',
            group: 'guild',
            description: 'Creates a movie/anime stream event.',
            args: [
                {
                    key: 'rabbitLink',
                    prompt: 'what is the stream link? (i.e Rabb.it)',
                    type: 'string'
                },
                {
                    key: 'streamLeader',
                    prompt: 'who is the stream coordinator?',
                    type: 'member'
                },
                {
                    key: 'streamName',
                    prompt: "what is the name of the anime/movie being streamed? (Used as a backup in case AniList doesn't work)",
                    type: 'string'
                },
                {
                    key: 'streamSource',
                    prompt: 'what is the source of the stream? (Use AniList for anime data)',
                    type: 'string'
                },
                {
                    key: 'movieStartTime',
                    prompt: 'how many minutes until the stream starts?',
                    type: 'integer'
                },
                {
                    key: 'targetChannel',
                    prompt: 'what channel would you like to send it to? (after confirmation)',
                    type: 'channel'
                }
            ],
            guildOnly: true,
        });
    }

    async run(message: commando.CommandMessage, args): Promise<any> {
        var cli: commando.CommandoClient = this.client;
        let desc = "Stream starts in " + args.movieStartTime + " minutes.";
        let argsrc = args.streamSource.replace("https://anilist.co/", "").split("/");
        let embed: discord.RichEmbed = new discord.RichEmbed();
        nani.get(argsrc[0] + "/" + argsrc[1]).then(function (response) {
            embed.setThumbnail(response.image_url_lge);
            embed.setTitle("Streaming: " + response.title_romaji);
            embed.setDescription(desc);
            embed.addField("Starts in", args.movieStartTime + " minutes", true);
            embed.addField("Total Episodes", response.total_episodes, true);
            embed.addField("Stream Link", args.rabbitLink, true);
            embed.addField("Average Rating", response.average_score / 10, true);
            embed.addField("Coordinator", args.streamLeader, true);
            embed.addField("Genres", response.genres.slice(0, 2).join(", "), true);
            embed.addField("Source", args.streamSource, true);
            embed.setFooter("Stream details compiled by GuildAssistant", cli.user.avatarURL);
            embed.setColor("blue");
            message.channel.sendEmbed(embed);
            message.reply("is the above embed OK? Type `yes` to send it to the announcements channel, and anything else to cancel.")
            message.channel.awaitMessages(x => x.author.id === message.author.id, {
                time: 30000,
                max: 1,
                errors: [ 'time' ]
            }).then(function (rep: discord.Collection<string, discord.Message>) {
                if (rep.first().content.startsWith("yes")) {
                    message.reply("sending...");
                    var a: discord.TextChannel = args.targetChannel as discord.TextChannel;
                    if (a.permissionsFor(message.author).hasPermission('SEND_MESSAGES') && a.permissionsFor(cli.user).hasPermission('SEND_MESSAGES')) {
                        a.sendEmbed(embed);
                        return message.reply("sent!");
                    }
                    else if (!a.permissionsFor(message.author).hasPermission('SEND_MESSAGES')){
                        return message.reply("you don't have permissions to send to #" + a.name + "! :anger:")
                    }
                    else {
                        return message.reply("I don't have permissions to send to #" + a.name + "! :anger:");
                    }
                }
                else {
                    message.reply("cancelled.");
                }
            }).catch(function (err) {
                return message.reply("cancelled.")
            })
        }).catch(function (err) {
            let embed: discord.RichEmbed = new discord.RichEmbed();
            embed.setTitle("Streaming: " + args.streamName);
            embed.setDescription("Stream starts in " + args.movieStartTime + " minutes.");
            embed.addField("Coordinator", args.streamLeader, true);
            embed.addField("Source", args.streamSource, true);
            embed.addField("Starts in", args.movieStartTime + " minutes", true);
            embed.addField("Stream Link", args.rabbitLink, true)
            message.channel.sendEmbed(embed);
            message.reply("is the above embed OK? Type `yes` to send it to the announcements channel, and anything else to cancel.")
            message.channel.awaitMessages(x => x.author.id === message.author.id, {
                time: 30000,
                max: 1,
                errors: [ 'time' ]
            }).then(function (rep: discord.Collection<string, discord.Message>) {
                if (rep.first().content.startsWith("yes")) {
                    message.reply("sending...");
                    var a: discord.TextChannel = args.targetChannel as discord.TextChannel;
                    if (a.permissionsFor(message.author).hasPermission('SEND_MESSAGES') && a.permissionsFor(cli.user).hasPermission('SEND_MESSAGES')) {
                        return a.sendEmbed(embed);
                    }
                    else if (!a.permissionsFor(message.author).hasPermission('SEND_MESSAGES')){
                        return message.reply("you don't have permissions to send to #" + a.name + "! :anger:")
                    }
                    else {
                        return message.reply("I don't have permissions to send to #" + a.name + "! :anger:");
                    }
                }
                else {
                    message.reply("cancelled.");
                }
            }).catch(function (err) {
                return message.reply("cancelled.")
            })
        });
    }
};