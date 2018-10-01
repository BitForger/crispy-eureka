/**
 * @author sn1p3r
 * @soundtrack God Knows... - Shoko Nakagawa
 */

class Commands {
  constructor(){}

  public executeHowGay(command, message) {
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
                return true;
              }
            });
            if (u) {
              message.channel.send(`<@${u.user.id}> is ${amount}% gay!`);
            }
          }
        }
      }

    }
  }
}

export default new Commands();
