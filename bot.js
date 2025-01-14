const { Telegraf, Markup }=require('telegraf');
require('dotenv').config();

// Variables para las imágenes de la lucha
const path=require('path');
const fs=require('fs');
const schedule=require('node-schedule');

// Inicializar el bot con el token desde el archivo .env
const bot=new Telegraf(process.env.TELEGRAM_TOKEN);


// Comandos básicos
bot.start((ctx) => 
    ctx.reply('Buenas tardes, soy Biscuit Oliva, el hombre más fuerte de América')
);

bot.help((ctx) => 
    ctx.reply(`Lista de <b>comandos</b> del Bot @OlivaBiscuitBot:
/help - obtener ayuda
/fight - lucha contra Biscuit Oliva
/resetpole - comando de prueba
/reflexion - Oliva te inspira con una frase motivacional
/rutina - muestra las mejores rutinas de gimnasio de Oliva

Cada día, podrás hacer una <b>pole</b>, <b>subpole</b> o <b>fail</b>. Estas se resetean a las 00:00.
/polerank - ranking de las poles`
    , {parse_mode: 'HTML'})
);

// Para que salgan todos los posibles comandos al usuario
bot.telegram.setMyCommands([
    {command: 'start', description: 'Inicia el bot Oliva'},
    {command: 'help', description: 'Muestra la lista de comandos'},
    {command: 'fight', description: 'Pelea contra Biscuit Oliva'},
    {command: 'polerank', description: 'Muestra el ranking de Poles'},
    {command: 'reflexion', description: 'Muestra una frase motivacional 🗿'},
    {command: 'rutina', description: 'Biscuit Oliva te enseña una rutina de gimnasio para ponerte igual de fuerte que él'}
]);


// FUNCIÓN DE LUCHA
// Rutas absolutas
const ataquesOliva = [
    { imagen: path.resolve(__dirname, 'Images/bola.jpg'), texto: 'Oliva usa su ataque Bola' },
    { imagen: path.resolve(__dirname, 'Images/bolsillos.png'), texto: 'Oliva se mete la mano en los bolsillos y te da tremenda paliza' },
    { imagen: path.resolve(__dirname, 'Images/cabezazo.jpg'), texto: 'Oliva te propina un cabezazo terrible' }
];

const ataquesUsuario = [
    { imagen: path.resolve(__dirname, 'Images/latigo.jpg'), texto: 'Contraatacas utilizando la mano de látigo' },
    { imagen: path.resolve(__dirname, 'Images/mano.png'), texto: 'Utilizas la Mano Venenosa para atacar a Oliva' },
    { imagen: path.resolve(__dirname, 'Images/mordisco.png'), texto: 'Intentas morder con fuerza a Oliva' }
];


// INICIAR PELEA
let combateEnCurso=false;
let turnoJugador=false;
let jugadorPuntos=0;
let olivaPuntos=0;

bot.command('fight', async (ctx) => {
    if (combateEnCurso) {
        ctx.reply('Ya hay un combate en curso. Por favor, espera a que termine.');
        return;
    }

    combateEnCurso=true;
    let turnoJugador=false;
    let jugadorPuntos=0;
    let olivaPuntos=0;

    ctx.reply('🚨🚨 COMIENZA LA LUCHA 🚨🚨');
    turnoDeOliva(ctx);
});
// Función para manejar el turno de Oliva
async function turnoDeOliva(ctx) {
    const randomAtaque = Math.floor(Math.random()*ataquesOliva.length);
    const defensaJugador = Math.floor(Math.random()*ataquesOliva.length);

    const fileStream = fs.createReadStream(ataquesOliva[randomAtaque].imagen);
    await ctx.replyWithPhoto({ source: fileStream }, { caption: ataquesOliva[randomAtaque].texto });

    if (randomAtaque === defensaJugador) {
        await ctx.reply('¡Te defiendes con éxito del ataque de Oliva! 🛡');
    } else {
        await ctx.reply('Oliva consigue encajar su ataque. Pierdes 1 vida ♥');
        olivaPuntos++;
    }

    // Verificar si alguien ganó
    verificarGanador(ctx);
    if (combateEnCurso) {
        turnoJugador=true;
        turnoDeJugador(ctx);
    }
}

// Función para manejar el turno del jugador
async function turnoDeJugador(ctx) {
    await ctx.reply(
        'Es tu turno de atacar. ¡Elige un ataque! ⚔',
        Markup.inlineKeyboard([
            Markup.button.callback('Látigo', 'ataque_0'),
            Markup.button.callback('Mano Venenosa', 'ataque_1'),
            Markup.button.callback('Mordisco', 'ataque_2')
        ])
    );
}
// Manejo del botón seleccionado por el jugador
bot.action(/ataque_\d/, async (ctx) => {
    if (!combateEnCurso || !turnoJugador) return;

    const ataqueSeleccionado=parseInt(ctx.match[0].split('_')[1]);
    const defensaBot=Math.floor(Math.random()*ataquesUsuario.length);

    const fileStream = fs.createReadStream(ataquesUsuario[ataqueSeleccionado].imagen);
    await ctx.replyWithPhoto({ source: fileStream }, { caption: ataquesUsuario[ataqueSeleccionado].texto });

    if (ataqueSeleccionado === defensaBot) {
        await ctx.reply('Oliva consigue defenderse de tu ataque!! 🛡');
    } else {
        await ctx.reply('Consigues encajar tu ataque. Oliva pierde 1 vida ♥');
        jugadorPuntos++;
    }

    // Verificar si alguien ganó
    verificarGanador(ctx);
    if (combateEnCurso) {
        turnoJugador=false;
        turnoDeOliva(ctx);
    }

    ctx.answerCbQuery();
});

// Verificar el ganador
function verificarGanador(ctx) {
    if (olivaPuntos >= 3) {
        ctx.reply('Oliva te ha derrotado. Se nota que es el hombre más fuerte de América 🌎');
        combateEnCurso=false;

    } else if (jugadorPuntos >= 3) {
        ctx.reply('🏆 ¡Has ganado la batalla contra Oliva! Felicidades.');
        combateEnCurso=false;
    }
}


// HEARS
bot.hears(['hola','Hola','HOLA'], (ctx) => {
    ctx.reply(`Hola @${ctx.from.username}, ¿Qué tal? Soy Biscuit Oliva, el hombre más fuerte de América.`);
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
// Función que sirve para añadir los usuarios y sus puntos al ArrayList
// CREAR BASE DE DATOS
// -----------------------------------------------------------------------
const sqlite3=require('sqlite3').verbose();
const db=new sqlite3.Database('db/poles.db', (err) => {
    if(err) {
        console.log(err);
    }
    console.log('Conexión a la base de datos lograda con éxito');
});
// Creación de la tabla. La fecha se agrega para pdoer verificar si ya se ha hecho una pole en este día o no
db.run(`
    CREATE TABLE IF NOT EXISTS POLES (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        CHAT_ID INTEGER NOT NULL,
        ID_USUARIO INTEGER NOT NULL,
        PUNTOS REAL,
        USERNAME TEXT,
        TIPO TEXT,
        FECHA DATE DEFAULT (DATE('now'))
    )
`);
// Función para agregar un nuevo registro a la tabla
function agregarPuntosDB(idChat, idUsuario, username, tipo, puntos) {
    const insercion='INSERT INTO POLES (CHAT_ID, ID_USUARIO, PUNTOS, USERNAME, TIPO) VALUES (?,?,?,?,?)';

    db.run(insercion, [idChat, idUsuario, puntos, username, tipo], (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log(`Pole insertada con éxito: ${username} hizo ${tipo}`);
        }
    });
}
// Función para  verificar las poles hechas en un día específico
function verificarTipoPole(idChat, tipo) {
    return new Promise((resolve, reject) => {
        const consulta=`SELECT * FROM POLES 
            WHERE CHAT_ID=? 
                AND TIPO=? 
                AND FECHA=DATE('now')`;

        db.get(consulta, [idChat, tipo], (err, row) => {
            if(err) {
                console.log('Error verificando la pole', err);
                resolve(false);
            } else {
                // Devolverá true si hay un registro
                resolve(!!row);
            }
        });
    });
}
function verificarUsuarioPole(idChat, idUsuario) {
    // Para realizar operaciones asíncronas
    return new Promise((resolve, reject) => {
        const consulta=`SELECT * FROM POLES
            WHERE CHAT_ID=?
                AND ID_USUARIO=?
                AND FECHA=DATE('now')`;
        
        db.get(consulta, [idChat, idUsuario], (err, row) => {
            if(err) {
                console.log('Error al verificar si el usuario hizo alguna acción', err);
                resolve(false);
            } else {
                resolve(!!row);
            }
        });
    });
}
// -----------------------------------------------------------------------
function agregarPuntos(id, gigapuntos, nombre, chatId) {
    const chat=chats.get(chatId);
    const usuario = chat.usuarios.find(u => u.id === id);

    if (usuario) {
        console.log('Usuario ya está añadido');
        // Se verifica que "valores" existe dentro del Array
        if (!Array.isArray(usuario.valores)) {
            usuario.valores = [];
        }
        usuario.valores.push(gigapuntos);
    } else {
        chat.usuarios.push({ id: id, nombre: nombre, valores: [gigapuntos] });
        console.log('Usuario añadido:', { id, valores: [gigapuntos] });
    }
}
// Funciones para RESETEAR la pole a las 00:00 todos los días
function resetPole() {
    db.run(`DELETE FROM POLES`); 
    console.log('POLE RESETEADA CORRECTAMENTE A LAS 00:00');   
}
bot.command('resetpole', (ctx) => {
    resetPole();
    ctx.reply('Pole restaurada');
});

// POLE
bot.hears(['pole', 'Oro', 'Pole', 'oro'], async (ctx) => {
    try {
        const chatId=ctx.chat.id;
        const idUsuario=ctx.from.id;
        const username=ctx.from.username;
        const nombre=ctx.from.first_name;
    
        // Con esto, verificaremos si se puede hacer la pole o no. Se usa await para que el programa no siga hasta
        // que lo cumpla
        const poleHecha=await verificarTipoPole(chatId, 'pole');
    
        if(!poleHecha) {
            const poleUsuario=await verificarUsuarioPole(chatId, idUsuario);

            if(!poleUsuario) {
                if(username) {
                    ctx.reply(`El usuario @${username} ha hecho la *pole*`, {parse_mode: 'Markdown'});
                } else {
                    ctx.reply(`El usuario ${nombre} ha hecho la *pole*`, {parse_mode: 'Markdown'});
                }
                
                agregarPuntosDB(chatId, idUsuario, username, 'pole', 3);
            } else {
                ctx.reply(`El usuario ${username} ya hizo pole / subpole / fail`);
            }
    
        } else {
            console.log('La pole ya se ha hecho');
        }

    } catch(error) {
        console.log('Error al manejar la pole');
    }
});

// SUBPOLE
bot.hears(['subpole','Subpole','Plata','plata'], async (ctx) => {
    try {
        const chatId=ctx.chat.id;
        const idUsuario=ctx.from.id;
        const username=ctx.from.username;
        const nombre=ctx.from.first_name;
    
        // Con esto, verificaremos si se puede hacer la pole o no. Se usa await para que el programa no siga hasta
        // que lo cumpla
        const subpoleHecha=await verificarTipoPole(chatId, 'subpole');
    
        if(!subpoleHecha) {
            const subpoleUsuario=await verificarUsuarioPole(chatId, idUsuario);

            if(!subpoleUsuario) {
                if(username) {
                    ctx.reply(`El usuario @${username} ha hecho la *subpole*`, {parse_mode: 'Markdown'});
                } else {
                    ctx.reply(`El usuario ${nombre} ha hecho la *subpole*`, {parse_mode: 'Markdown'});
                }
                
                agregarPuntosDB(chatId, idUsuario, username, 'subpole', 3);
            } else {
                ctx.reply(`El usuario ${username} ya hizo pole / subpole / fail`);
            }
    
        } else {
            console.log('La subpole ya se ha hecho');
        }

    } catch(error) {
        console.log('Error al manejar la subpole');
    }
});

// FAIL
bot.hears(['fail','Fail','bronce','Bronce'], async (ctx) => {
    try {
        const chatId=ctx.chat.id;
        const idUsuario=ctx.from.id;
        const username=ctx.from.username;
        const nombre=ctx.from.first_name;
    
        // Con esto, verificaremos si se puede hacer la pole o no. Se usa await para que el programa no siga hasta
        // que lo cumpla
        const failHecho=await verificarTipoPole(chatId, 'fail');
    
        // Verificamos que no se haya hecho el fail antes, en un chat específico
        if(!failHecho) {
            const subpoleUsuario=await verificarUsuarioPole(chatId, idUsuario);
            // Verificamos que el usuario en cuestión no haya hecho la "subpole" o "fail". Si lo ha hechon o podrá hacer la pole
            if(!subpoleUsuario) {
                if(username) {
                    ctx.reply(`El usuario @${username} ha hecho el *fail*`, {parse_mode: 'Markdown'});
                } else {
                    ctx.reply(`El usuario ${nombre} ha hecho el *fail*`, {parse_mode: 'Markdown'});
                }
                
                agregarPuntosDB(chatId, idUsuario, username, 'fail', 3);
            } else {
                ctx.reply(`El usuario ${username} ya hizo pole / subpole / fail`);
            }
    
        } else {
            console.log('El fail ya se ha hecho');
        }

    } catch(error) {
        console.log('Error al manejar el fail');
    }
});

// POLERANK
bot.command('polerank', (ctx) => {
    const chatID=ctx.chat.id;
    inicializarChat(chatID);

    const chat=chats.get(chatID);

    if(chat.usuarios.length == 0) {
        ctx.reply('*Nadie ha hecho ninguna pole todavía*', {parse_mode: 'Markdown'});

    } else {
        let mensaje='🏆 *RANKING DE LAS POLES* 🏆\n---------------------------------------------------';
        let puntuacionMax=[]
    
        chat.usuarios.forEach(u => {
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
    ctx.reply(`_"${frasesMotivacionales[numero]}"_`, {parse_mode: 'MarkdownV2'});
});


// RUTINAS
listaRutinas = [
    // PPL
    `*PUSH PULL LEGS (PPL):*
_Día 1:_
    - Push (Pecho, Hombros, Tríceps):
    - Press banca con barra (4x8-12)
    - Press inclinado con mancuernas (4x10-12)
    - Fondos en paralelas (3x hasta el fallo)
    - Press militar (4x8-10)
    - Elevaciones laterales (4x12-15)
    - Extensiones de tríceps en polea (3x12-15)

_Día 2:_
    - Pull (Espalda, Bíceps, Trapecios):
    - Dominadas (4x8-12)
    - Remo con barra (4x10-12)
    - Jalón al pecho (4x12)
    - Pull-over con mancuerna (4x12)
    - Curl de bíceps con barra (4x10)
    - Curl martillo (3x12)
    - Encogimientos para trapecios (4x15)

_Día 3:_
    - Legs (Piernas y core):
    - Sentadilla con barra (4x8-12)
    - Prensa inclinada (4x10-12)
    - Peso muerto rumano (4x8-10)
    - Zancadas con mancuernas (3x12 por pierna)
    - Extensiones de piernas en máquina (4x12-15)
    - Elevaciones de gemelos de pie (4x15-20)
    - Plancha abdominal (3x1 minuto)`,

    // ARNOLD
    `*ARNOLD SPLIT:*
_Día 1:_ 
    - Pecho y Espalda:
    - Press banca con barra (4x8-12)
    - Aperturas con mancuernas (4x12)
    - Dominadas (4x8-12)
    - Remo con barra (4x10-12)
    - Jalón al pecho (4x12)
    - Pull-over con mancuerna (4x12)

_Día 2:_
    - Hombros y Brazos:
    - Press militar con barra (4x8-10)
    - Elevaciones laterales con mancuernas (4x12-15)
    - Pájaros para deltoides posteriores (4x12-15)
    - Curl con barra (4x10)
    - Curl martillo (4x12)
    - Extensiones de tríceps en polea (3x12-15)
    - Press francés (3x12)

_Día 3:_
    - Piernas y Core:
    - Sentadilla con barra (4x8-12)
    - Peso muerto rumano (4x8-10)
    - Zancadas con mancuernas (3x12 por pierna)
    - Prensa inclinada (4x10-12)
    - Extensiones de piernas en máquina (4x12-15)
    - Curl femoral en máquina (4x12-15)
    - Elevaciones de gemelos (4x15-20)
    - Plancha abdominal (3x1 minuto)`,

    // FULL BODY
    `*FULL BODY:*
_Día 1:_
    - Sentadilla con barra (4x8-12)
    - Press banca con barra (4x8-12)
    - Remo con barra (4x10-12)
    - Dominadas (3x hasta el fallo)
    - Press militar (4x8-10)
    - Curl de bíceps con barra (4x10)
    - Extensiones de tríceps en polea (3x12)

_Día 2:_
    - Peso muerto (4x8-10)
    - Press inclinado con mancuernas (4x10-12)
    - Remo con mancuernas (4x12)
    - Fondos en paralelas (3x hasta el fallo)
    - Elevaciones laterales con mancuernas (4x12-15)
    - Curl martillo (3x12)
    - Plancha abdominal (3x1 minuto)

_Día 3:_
    - Prensa inclinada (4x10-12)
    - Pull-over con mancuerna (4x12)
    - Sentadilla frontal (4x8-10)
    - Dominadas lastradas (4x8-12)
    - Encogimientos para trapecios (4x15)
    - Curl concentrado (3x12 por brazo)
    - Elevaciones de gemelos (4x15-20)`
];

bot.command('rutina', (ctx) => {
    numero=Math.floor(Math.random()*listaRutinas.length);
    ctx.reply(`${listaRutinas[numero]}`, {parse_mode: 'Markdown'});
});


// Iniciar el bot
bot.launch();