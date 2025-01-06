const { Telegraf } =require('telegraf'); // Importación correcta
require('dotenv').config(); // Cargar variables de entorno

// Inicializar el bot con el token desde el archivo .env
const bot=new Telegraf(process.env.TELEGRAM_TOKEN);

let poleHecha=false;

function resetPoleDiaria() {
    const ahora=new Date();
    const proximoReset=new Date(ahora);

}

// Comandos básicos
bot.start((ctx) => 
    ctx.reply('¡Hola! Soy tu bot de Telegram.')
);

bot.help((ctx) => 
    ctx.reply(`Lista de <b>comandos</b> del Bot @OlivaBiscuitBot:
    /help - obtener ayuda
    /fight - luchar contra Biscuit Oliva
    /resetpole - comando de prueba
    /polerank - ranking de las poles`
    , {parse_mode: 'HTML'})
);

bot.command('resetpole', (ctx) => {
    poleHecha=false;
    ctx.reply('Pole restaurada');
});

bot.command('fight', (ctx) => {
    ctx.reply('COMIENZA LA LUCHA');

    cont=0;


});

bot.hears(['hola','Hola','HOLA'], (ctx) => {
    ctx.reply(`Hola @${ctx.from.username}, ¿Qué tal? Soy Biscuit Oliva, el hombre más fuerte de América.`);
    console.log(ctx.from.id);
});
bot.hears(['Yugor','yugor'], (ctx) => {
    ctx.reply('Hola Maestro Yugor @asistentelink');
});

// FUNCIÓN DE POLE
/* A las 00:00, los usuarios podrán hacer pole y ganar puntos
        - pole: 3 Giga-Puntos
        - subpole: 1 Giga-Punto
        - fail: 0,5 Giga-Puntos
*/
// ArrayList de Usuarios
let usuarios=[];
// Función que sirve para añadir los usuarios y sus puntos al ArrayList
function agregarPuntos(id, gigapuntos, username) {
    const usuario = usuarios.find(u => u.id === id);

    if (usuario) {
        console.log('Usuario ya está añadido');
        // Se verifica que "valores" existe dentro del Array
        if (!Array.isArray(usuario.valores)) {
            usuario.valores = [];
        }
        usuario.valores.push(gigapuntos);
    } else {
        usuarios.push({ id: id, usuario: username, valores: [gigapuntos] });
        console.log('Usuario añadido:', { id, valores: [gigapuntos] });
    }
}
// POLE
bot.hears(['pole', 'Oro', 'Pole', 'oro'], (ctx) => {
    if(poleHecha === false) {
        const username=ctx.from.username;
        const usuario=ctx.from.id;

        if(username) {
            ctx.reply(`El usuario @${username} ha hecho la *pole*`, {parse_mode: 'Markdown'});
            poleHecha=true;
            agregarPuntos(usuario, 3, username);

        } else {
            ctx.reply(`El usuario ${ctx.from.first_name} ha hecho la *pole*`, {parse_mode: 'Markdown'});
            poleHecha=true;
            agregarPuntos(usuario, 3, username);
        }
    }
});
// SUBPOLE
bot.hears(['subpole','Subpole','Plata','plata'], (ctx) => {
    const username=ctx.from.username;

    if(username) {
        ctx.reply(`El usuario @${username} ha hecho la *subpole*`, {parse_mode: 'Markdown'});
    } else {
        ctx.reply(`El usuario @${ctx.from.first_name} ha hecho la *subpole*`, {parse_mode: 'Markdown'});
    }
});
// FAIL
bot.hears(['fail','Fail','bronce','Bronce'], (ctx) => {
    const username=ctx.from.username;

    if(username) {
        ctx.reply(`El usuario @${username} ha hecho el *fail*`, {parse_mode: 'Markdown'});
    } else {
        ctx.reply(`El usuario @${ctx.from.first_name} ha hecho el *fail*`, {parse_mode: 'Markdown'});
    }
});
// POLERANK
bot.command('polerank', (ctx) => {
    let mensaje='RANKING DE LAS POLES';

    usuarios.forEach(u => {
        let nombreUsuario=u.username;
        let totalPuntos=0;

        u.valores.forEach(valor => {
            totalPuntos+=valor;
        });

        mensaje+=`\n*${nombreUsuario}* ${totalPuntos} = Giga-Puntos`;
    });

    console.log(usuarios);
    ctx.reply(mensaje, {parse_mode: 'Markdown'});
});


/* Funcionalidades a agregar:
 - Frases motivacionales de Biscuit Oliva
 - Pole, subpole...
 - Rutinas de gym de Biscuit Oliva

*/

// Inicia el bot
bot.launch();

console.log('Bot en ejecución...');