const { Telegraf } =require('telegraf'); // Importación correcta
require('dotenv').config(); // Cargar variables de entorno

// Inicializar el bot con el token desde el archivo .env
const bot=new Telegraf(process.env.TELEGRAM_TOKEN);

// Comando básico para probar
bot.start((ctx) => ctx.reply('¡Hola! Soy tu bot de Telegram.'));

bot.help((ctx) => 
    ctx.reply(`Lista de <b>comandos</b> del Bot @OlivaBiscuitBot:
    /help - obtener ayuda
    /fight - luchar contra Biscuit Oliva`
    , {parse_mode: 'HTML'})
);

bot.settings((ctx) => ctx.reply('Ajustes del bot'));

bot.command('fight', (ctx) => {
    ctx.reply('COMIENZA LA LUCHA')
});

bot.hears(['hola','Hola','HOLA'], (ctx) => {
    ctx.reply(`Hola @${ctx.from.username}, ¿Qué tal? Soy Biscuit Oliva, el hombre más fuerte de América`)
});


// FUNCIÓN DE POLE
/* A las 00:00, los usuarios podrán hacer pole y ganar puntos
        - pole: 3 Giga-Puntos
        - subpole: 1 Giga-Punto
        - fail: 0,5 Giga-Puntos
*/
// POLE
bot.hears(['pole', 'Oro', 'Pole', 'oro'], (ctx) => {
    const username=ctx.from.username;

    if(username) {
        ctx.reply(`El usuario @${username} ha hecho la *pole*`, {parse_mode: 'Markdown'});
    } else {
        ctx.reply(`El usuario ${ctx.from.first_name} ha hecho la *pole*`, {parse_mode: 'Markdown'});
    }
});
// SUBPOLE
bot.hears(['subpole','Subpole','Plata','plata'], (ctx) => {
    const username=ctx.from.username;

    if(username) {
        ctx.reply(`El usuario @${username} ha hecho la *pole*`, {parse_mode: 'Markdown'});
    } else {
        ctx.reply(`El usuario @${ctx.from.first_name} ha hecho la *pole*`, {parse_mode: 'Markdown'});
    }
});

/* Funcionalidades a agregar:
 - Frases motivacionales de Biscuit Oliva
 - Pole, subpole...
 - Rutinas de gym de Biscuit Oliva

*/

// Inicia el bot
bot.launch();

console.log('Bot en ejecución...');