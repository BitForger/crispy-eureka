/**
 * @Author sn1p3r
 * @soundtrack Dripping - Submersed
 */

import { Client, Collection, Guild, GuildMember, Message, MessageSearchResult, PresenceData, User } from 'discord.js';
import Config                                                                                       from "./config";
import Commands                                                                                     from './commands';

const client = new Client();
const config = new Config();

const prefix = 'smith';

client.on("message", message => {
  message.content = message.content.toLowerCase();
  if ( message.content.startsWith(prefix) ) {
    let command = message.content.replace(prefix, '').trim();
    switch ( command ) {
      case 'hello':
        message.channel.send(`${message.author.username}`);
        break;
      case 'howgay':
        Commands.executeHowGay(command, message);
        break;
      default:
        message.channel.send(`I don't know that command`);
    }
  }
});

client.on("ready", () => {
  let user = client.user;
  user.setUsername("Smith");
  const presence: PresenceData = {
    status: 'idle',
  };
  user.setPresence(presence)
    .then();
  console.log(`Successful startup as ${user.username}`)
});

client.on("error", (error) => {
  console.log(error);
});

client.login(config.token).then(() => {
});
