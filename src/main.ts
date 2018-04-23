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
    if (command === 'howgay') {
      let amount = Math.random();
      message.channel.send(`${message.author.username} is ${amount}% gay.`);
    }
  }
});

client.on("ready", () => {
  let user = client.user;
  user.setUsername("Smith");
  user.setPresence({
    game: {
      name: "with discord.js",
      type: 'PLAYING'
    },
    status: "online"
  })
    .then();
  console.log(`Successful startup as ${user.username}`)
});

client.login(config.token).then(() => {});