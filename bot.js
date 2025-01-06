const { Telegraf } =require('telegraf'); // Importación correcta
require('dotenv').config(); // Cargar variables de entorno

// Inicializar el bot con el token desde el archivo .env
const bot=new Telegraf(process.env.TELEGRAM_TOKEN);

let poleHecha=false;
let subpoleHecha=false;
let failHecho=false;

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
// Para que salgan todos los posibles comandos al usuario
bot.telegram.setMyCommands([
    {command: 'start', description: 'Inicia el bot Oliva'},
    {command: 'help', description: 'Muestra la lista de comandos'},
    {command: 'fight', description: 'Pelea contra Biscuit Oliva'},
    {command: 'polerank', description: 'Muestra el ranking de Poles'},
    {command: 'reflexion', description: 'Muestra una frase motivacional 🗿'}
]);


// FUNCIÓN DE LUCHA
bot.command('fight', (ctx) => {
    ctx.reply('COMIENZA LA LUCHA');

    cont=0;


});


// HEARS
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
function agregarPuntos(id, gigapuntos, nombre) {
    const usuario = usuarios.find(u => u.id === id);

    if (usuario) {
        console.log('Usuario ya está añadido');
        // Se verifica que "valores" existe dentro del Array
        if (!Array.isArray(usuario.valores)) {
            usuario.valores = [];
        }
        usuario.valores.push(gigapuntos);
    } else {
        usuarios.push({ id: id, nombre: nombre, valores: [gigapuntos] });
        console.log('Usuario añadido:', { id, valores: [gigapuntos] });
    }
}
bot.command('resetpole', (ctx) => {
    poleHecha=false;
    subpoleHecha=false;
    failHecho=false;
    ctx.reply('Pole restaurada');
});

// POLE
bot.hears(['pole', 'Oro', 'Pole', 'oro'], (ctx) => {
    if(poleHecha === false) {
        const username=ctx.from.username;
        const nombre=ctx.from.first_name;
        const usuario=ctx.from.id;

        if(username) {
            ctx.reply(`El usuario @${username} ha hecho la *pole*`, {parse_mode: 'Markdown'});
            poleHecha=true;
            agregarPuntos(usuario, 3, nombre);

        } else {
            ctx.reply(`El usuario ${ctx.from.first_name} ha hecho la *pole*`, {parse_mode: 'Markdown'});
            poleHecha=true;
            agregarPuntos(usuario, 3, nombre);
        }
    }
});

// SUBPOLE
bot.hears(['subpole','Subpole','Plata','plata'], (ctx) => {
    if(subpoleHecha === false) {
        const username=ctx.from.username;
        const nombre=ctx.from.first_name;
        const usuario=ctx.from.id;

        if(username) {
            ctx.reply(`El usuario @${username} ha hecho la *subpole*`, {parse_mode: 'Markdown'});
            subpoleHecha=true;
            agregarPuntos(usuario, 1, nombre);

        } else {
            ctx.reply(`El usuario @${ctx.from.first_name} ha hecho la *subpole*`, {parse_mode: 'Markdown'});
            subpoleHecha=true;
            agregarPuntos(usuario, 1, nombre);
        }
    }
});

// FAIL
bot.hears(['fail','Fail','bronce','Bronce'], (ctx) => {
    if(failHecho === false) {
        const username=ctx.from.username;
        const nombre=ctx.from.first_name;
        const usuario=ctx.from.id;

        if(username) {
            ctx.reply(`El usuario @${username} ha hecho el *fail*`, {parse_mode: 'Markdown'});
            subpoleHecha=true;
            agregarPuntos(usuario, 0.5, nombre);

        } else {
            ctx.reply(`El usuario @${ctx.from.first_name} ha hecho el *fail*`, {parse_mode: 'Markdown'});
            subpoleHecha=true;
            agregarPuntos(usuario, 0.5, nombre);

        }
    }
});

// POLERANK
bot.command('polerank', (ctx) => {
    if(usuarios.length == 0) {
        ctx.reply('*Nadie ha hecho ninguna pole todavía*', {parse_mode: 'Markdown'});

    } else {
        let mensaje='🏆 *RANKING DE LAS POLES* 🏆\n---------------------------------------------------';
        let puntuacionMax=[]
    
        usuarios.forEach(u => {
            let nombreUsuario=u.nombre;
            let totalPuntos=0;
    
            u.valores.forEach(valor => {
                totalPuntos+=valor;
            });
    
            puntuacionMax.push({nombre: nombreUsuario, total: totalPuntos});
            //mensaje+=`\n*${nombreUsuario}* = ${totalPuntos} Giga-Puntos`;
        });
    
        // Ordenamos los usuarios de mayor a menos número de puntos
        puntuacionMax.sort((a, b) => b.total - a.total);
        contRank=0;
    
        puntuacionMax.forEach(t => {
            contRank++;
            
            switch(contRank) {
                case 1:
                    mensaje+=`\n1️⃣ *${t.nombre}* = ${t.total} Giga-Puntos`;
                    break;
                case 2:
                    mensaje+=`\n2️⃣ *${t.nombre}* = ${t.total} Giga-Puntos`;
                    break;
                case 3:
                    mensaje+=`\n3️⃣ *${t.nombre}* = ${t.total} Giga-Puntos`;
                    break;
                default:
                    mensaje+=`\n🆗 *${t.nombre}* = ${t.total} Giga-Puntos`;
                    break;
            }   
        });
    
        ctx.reply(mensaje, {parse_mode: 'Markdown'});
    }

});


// LISTA DE FRASES MOTIVACIONALES
frasesMotivacionales = [
    "La felicidad de tu vida depende de la calidad de tus pensamientos",
    "No son las cosas las que nos perturban, sino la opinión que tenemos de ellas",
    "La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades",
    "Primero di lo que quieres ser; luego haz lo que tienes que hacer",
    "Recuerda que no puedes controlar los acontecimientos, solo cómo reaccionas ante ellos",
    "La dificultad muestra lo que los hombres son",
    "No te preocupes por la muerte, preocúpate por no haber empezado a vivir",
    "La verdadera riqueza es vivir con poco, no porque tengas poco, sino porque necesitas menos",
    "El hombre valiente no es el que no siente miedo, sino el que lo conquista",
    "Si quieres ser feliz, deja de desear lo que no tienes y aprecia lo que tienes"
];

bot.command('reflexion', (ctx) => {
    numero=Math.floor(Math.random()*frasesMotivacionales.length);
    ctx.reply(`_"${frasesMotivacionales[numero]}"_`, {parse_mode: 'Markdown'});
});


/* Funcionalidades a agregar:
 - Frases motivacionales de Biscuit Oliva
 - Pole, subpole...
 - Rutinas de gym de Biscuit Oliva

*/

// Iniciar el bot
bot.launch();