require('dotenv').config();
export default class Config {
  constructor() {
  }
  token: string = process.env.BOT_TOKEN || null;
  spotify_id = process.env.SPOTIFY_CLIENT_ID || null;
  spotify_secret = process.env.SPOTIFY_CLIENT_SECRET || null;
}
