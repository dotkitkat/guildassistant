import commando = require('discord.js-commando')
import discord = require('discord.js')
const config = require('../../config.json');
const nani = require('nani').init(config.anilistApiId, config.anilistApiSecret);

module.exports = class StreamCreateCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'stream',
            memberName: 'stream',
            group: 'kud',
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
                    key: 'tagEveryone',
                    prompt: 'would you like to tag everyone?',
                    type: 'boolean'
                },
                {
                    key: 'movieStartTime',
                    prompt: 'how many minutes until the stream starts?',
                    type: 'integer'
                }
            ]
        });
        const clientdata = client;
    }

    async run(message, args): Promise<any> {
        // https://anilist.co/anime/20958/ShingekinoKyojin2
        let desc = "Stream starts in " + args.movieStartTime + " minutes.";
        console.log(args.streamSource.replace("https://anilist.co/", ""));
        let argsrc = args.streamSource.replace("https://anilist.co/", "").split("/");
        let embed: discord.RichEmbed = new discord.RichEmbed();
        nani.get(argsrc[0] + "/" + argsrc[1]).then(function (response) {
            embed.setThumbnail(response.image_url_lge);
            embed.setTitle("Streaming: " + response.title_romaji);
            if (args.tagEveryone) {
                desc = desc + " Tagging @everyone";
            }
            embed.setDescription(desc);
            embed.addField("Starts in", args.movieStartTime + " minutes", true);
            embed.addField("Total Episodes", response.total_episodes, true);
            embed.addField("Stream Link", args.rabbitLink, true);
            embed.addField("Average Rating", response.average_score / 10, true);
            embed.addField("Coordinator", args.streamLeader, true);
            embed.addField("Genres", response.genres.slice(0, 2).join(", "), true);
            embed.addField("Source", args.streamSource, true);
            embed.setFooter("Stream details compiled by Azure", this.clientdata.avatarURL);
            embed.setColor("blue");
            return message.channel.sendEmbed(embed);
        }).catch(function (err) {
            let embed: discord.RichEmbed = new discord.RichEmbed();
            console.log(err);
            embed.setTitle("Streaming: " + args.streamName);
            embed.setDescription("Stream starts in " + args.movieStartTime + " minutes.");
            embed.addField("Coordinator", args.streamLeader, true);
            embed.addField("Source", args.streamSource, true);
            embed.addField("Starts in", args.movieStartTime + " minutes", true);
            return message.channel.sendEmbed(embed);
        });
    }
};