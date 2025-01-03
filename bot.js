const Telegraf=require('telegraf')
// Para evitar que se vea el Token desde GitHub, se guarda en un .env
require('dotenv').config(); 

// Token del bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.start()