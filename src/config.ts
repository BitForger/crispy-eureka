require('dotenv').config();
export default class Config {
  constructor() {
  }
  token: string = process.env.BOT_TOKEN;
}