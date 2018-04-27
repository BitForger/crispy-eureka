/**
 * @Author sn1p3r
 * @soundtrack Dripping - Submersed
 */

import { Client, Guild, User } from 'discord.js';
import Config                  from "./config";
import * as Commando           from 'discord.js-commando';

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
    if (command.startsWith('howgay')) {
      let amount = Math.floor(Math.random() * Math.floor(100));
      if (command.length === 'howgay'.length) {
        message.channel.send(`${message.author.username} is ${amount}% gay.`);
      }
      else {
        const splitCommand = command.split(" ");
        splitCommand.shift(); //NOTE remove the actual command from string
        let flags = splitCommand;
        for (let i = 0; i < flags.length; i++) {
          let flag = flags[i];
          if ( flag.startsWith('--') ) {
            flag = flag.substr(2);
            if (flag === "user") {
              flags = flags.slice(i + 1);
              let user = flags[0];
              const guild = message.guild;
              let u = guild.members.find((value, key) => {
                if (value.displayName === user) {
                  return value;
                }
              });
              if (u) {
                message.channel.send(`${u.displayName} is ${amount}% gay!`);
              }
            }
            if (flag === "mention") {
              // TODO figure out a way to allow a mention to be sent
            }
          }
        }

      }
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

client.on("error", (error) => {
  console.log(error);
});

client.login(config.token).then(() => {});