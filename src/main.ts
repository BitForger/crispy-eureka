/**
 * @Author sn1p3r
 * @soundtrack Dripping - Submersed
 */

import { Client } from 'discord.js';
import Config                   from "./config";
import * as Commando            from 'discord.js-commando';

const client = new Commando.Client();
const config = new Config();

const prefix = 'smith';

client.on("message", message => {
  message.content = message.content.toLowerCase();
  if (message.content.startsWith(prefix)) {
    let command = message.content.replace(prefix, '').trim();
    if ( command === 'hello' ) {
      message.channel.send(`${message.author.username}`);
    }
  }
});

client.on("ready", () => {
  let user = client.user;
  client.user.setUsername("Smith");
  client.user.setPresence({
    game: {
      name: "with discord.js",
      type: 'PLAYING'
    },
    status: "dnd"
  })
    .then();
  console.log(`Successful startup as ${client.user.username}`)
});

client.login(config.token).then(() => {});