const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const axios = require('axios');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51QTYY1KKAL9Zx73kPBrLyHJRtyRXZoXGcWkcXI4tC1lW0vqw3upqThCRMCWBSOicF9uQseweEzAj2fwn58SvltPM008UDAMcDX'); // Clave de STRIPE
const TMDB_API_KEY = '5c208ff4ecedc410685c70b86d4abcd9'; //Clave peliculas


const crypto = require('crypto');
const bcrypt = require('bcrypt');

app.use(cors());  // Permite todas las solicitudes desde cualquier origen

// Ruta donde se guardarán los archivos JSON en el NFS
//const NFS_PATH = '/mnt2/nfs_clientshare4svm/usuarios';
const NFS_PATH = '/mnt2/nfs_clientshare4svm/usuarios';
const USERS_FILE = path.join(NFS_PATH, 'usuarios.json');
const PAYMENTS_FILE = path.join(NFS_PATH, 'historial_pagos.json');
const NOTIFICATIONS_FILE = path.join(NFS_PATH, 'notificaciones.json');
const USER_GROUP_FILE = path.join(NFS_PATH, 'usuario_grupo.json'); // Relación usuario-grupo
const SUBSCRIPTIONS_FILE = path.join(NFS_PATH, 'suscripciones.json');
const SERV_SUB_FILE = path.join(NFS_PATH, 'servicio_suscripcion.json');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (!fs.existsSync(NFS_PATH)) {
    fs.mkdirSync(NFS_PATH, { recursive: true });
}

const files = [USERS_FILE, PAYMENTS_FILE, NOTIFICATIONS_FILE, USER_GROUP_FILE, SUBSCRIPTIONS_FILE];
files.forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([]));
    }
});


//Encriptar y desencriptar
// Función para cifrar
const secretKey = 'mi_clave_secreta_12345_ghjlo_hyt'

function encryptData(data) {
    const iv = crypto.randomBytes(16); // Vector de inicialización aleatorio
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Función para descifrar
// Función para desencriptar datos
function decryptData(encryptedData, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


// Función para encriptar la contraseña usando bcrypt
async function encryptPassword(password) {
    const saltRounds = 10; // Número de rondas de salting para bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}




app.get('/usuarios', (req, res) => {
    try {
        // Leer archivo cifrado y desencriptarlo
        const encryptedData = fs.readFileSync(USERS_FILE, 'utf-8');
        const usuarios = encryptedData ? decrypt(encryptedData) : [];

        res.json(usuarios);
    } catch (err) {
        console.error('Error al leer usuarios:', err);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});



// Nuevo usuario con cifrado de contraseña
app.post('/usuario', async (req, res) => {
    const nuevoUsuario = req.body;
    
    // Encriptar nombre y correo
    const nombreEncriptado = encryptData(nuevoUsuario.fullname);
    const correoEncriptado = encryptData(nuevoUsuario.email);
    
    // Encriptar la contraseña con bcrypt
    const hashedPassword = await encryptPassword(nuevoUsuario.password);

    const usuarios = JSON.parse(fs.readFileSync(USERS_FILE));
    nuevoUsuario.id = usuarios.length + 1; 
    nuevoUsuario.fullname = nombreEncriptado; // Guarda el nombre encriptado
    nuevoUsuario.email = correoEncriptado; // Guarda el correo encriptado
    nuevoUsuario.password = hashedPassword; // Guarda la contraseña encriptada

    usuarios.push(nuevoUsuario);
    fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios)); // Guarda el nuevo usuario en el archivo

    res.status(201).json({ message: 'Usuario creado correctamente', usuario: nuevoUsuario });
});





// Endpoint de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usuarios = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

    // usuario por nombre
    const usuario = usuarios.find(u => {
      
        console.log(u);  

        if (u.fullname && u.fullname.encryptedData && u.fullname.iv && u.email && u.email.encryptedData && u.email.iv) {
            // Desencriptar el nombre de usuario y correo
            const decryptedUsername = decryptData(u.fullname.encryptedData, u.fullname.iv);
            const decryptedEmail = decryptData(u.email.encryptedData, u.email.iv);

            // Comparar los valores desencriptados con el username proporcionado
            return decryptedUsername === username; 
        } else {
            
            return false;
        }
    });

    if (usuario) {
        // Comparar la contraseña proporcionada con el hash almacenado
        const match = await bcrypt.compare(password, usuario.password);

        if (match) {
            res.json({ userId: usuario.id, message: 'Login exitoso' });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
});




// Ruta para obtener historial de pagos
app.get('/pagos', (req, res) => {
    const pagos = JSON.parse(fs.readFileSync(PAYMENTS_FILE));
    res.json(pagos);
});

// Crear historial de pagos
app.post('/pago', (req, res) => {
    const nuevoPago = req.body;
    const pagos = JSON.parse(fs.readFileSync(PAYMENTS_FILE));
    nuevoPago.id = pagos.length + 1; 
    pagos.push(nuevoPago);
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(pagos)); 
    res.status(201).json({ message: 'Pago registrado correctamente', pago: nuevoPago });
});

// Ruta para obtener notificaciones
app.get('/notificaciones', (req, res) => {
    const notificaciones = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE));
    res.json(notificaciones);
});

// Ruta para agregar notificación
app.post('/notificacion', (req, res) => {
    const nuevaNotificacion = req.body;
    const notificaciones = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE));
    nuevaNotificacion.id = notificaciones.length + 1; // Asigna un nuevo ID
    notificaciones.push(nuevaNotificacion);
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notificaciones)); // Guarda la nueva notificación
    res.status(201).json({ message: 'Notificación agregada correctamente', notificacion: nuevaNotificacion });
});

// Ruta para obtener suscripciones
app.get('/suscripciones', (req, res) => {
    const suscripciones = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE));
    res.json(suscripciones);
});



// Unirse a un grupo
app.get('/gruposdisponibles/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId; 
    
    if (!usuarioId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }

    try {
       
        const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8')); // Relaciones usuario-grupo
        const grupos = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8')); // Todos los grupos

        console.log('Usuario ID recibido:', usuarioId);

        // IDs de grupos asociados al usuario 
        const gruposAsociadosIds = usuarioGrupo
            .filter(ug => parseInt(ug.userId) === parseInt(usuarioId)) 
            .map(ug => ug.groupId);

        console.log('IDs de grupos asociados al usuario:', gruposAsociadosIds);

      
        const gruposDisponibles = grupos.filter(grupo =>
            !gruposAsociadosIds.includes(grupo.id) && 
            grupo.currentUsers < grupo.maxUsers 
        );

        console.log('Grupos disponibles para el usuario:', gruposDisponibles);

        res.json(gruposDisponibles);
    } catch (err) {
        console.error('Error al obtener los grupos disponibles:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});




const generarIdCorto = () => {
    return Math.floor(1000 + Math.random() * 9000); // ID entre 1000 y 9999
};

app.post('/api/grupos/crear', (req, res) => {
    const { name, serviceType, maxUsers, costPerUser, paymentPolicy, userId } = req.body;

    if (!name || !serviceType || !maxUsers || !costPerUser || !paymentPolicy || !userId) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const fechaCreacion = new Date();
    const fechaLimite = new Date(fechaCreacion);
    fechaLimite.setDate(fechaLimite.getDate() + 7);

    const nuevoGrupo = {
        id: generarIdCorto(), 
        name,
        serviceType,
        maxUsers,
        currentUsers: 1,
        costPerUser,
        paymentPolicy,
        fechaCreacion: fechaCreacion.toISOString(),
        fechaLimite: fechaLimite.toISOString()
    };

    fs.readFile(SUBSCRIPTIONS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error al leer suscripciones' });

        const grupos = JSON.parse(data);
        grupos.push(nuevoGrupo);

        fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(grupos, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Error al guardar el grupo' });

            fs.readFile(USER_GROUP_FILE, 'utf8', (err, data) => {
                if (err) return res.status(500).json({ message: 'Error al leer relaciones' });

                const usuarioGrupo = JSON.parse(data);
                usuarioGrupo.push({ 
                    userId: userId, 
                    groupId: nuevoGrupo.id, 
                    createdAt: nuevoGrupo.fechaCreacion 
                });

                fs.writeFile(USER_GROUP_FILE, JSON.stringify(usuarioGrupo, null, 2), (err) => {
                    if (err) return res.status(500).json({ message: 'Error al guardar relación' });
                    res.status(201).json({ message: 'Grupo creado exitosamente', groupId: nuevoGrupo.id });
                });
            });
        });
    });
});



// Ruta para obtener los grupos de un usuario
app.get('/api/grupos/usuario', (req, res) => {
    const usuarioId = req.query.usuarioId; // Obtener el ID del usuario desde la consulta
    if (!usuarioId) {
       return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }
    try {
       // Leer las relaciones usuario-grupo
       const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));
       // Leer todos los grupos disponibles
       const grupos = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
       // Filtrar los grupos asociados al usuario
       const gruposDelUsuario = usuarioGrupo
           .filter(ug => ug.userId === parseInt(usuarioId)) // Comparar userId como número
           .map(ug => {
               // Buscar detalles de los grupos
               const grupo = grupos.find(grupo => grupo.id === ug.groupId);
               // Si el grupo existe, agregar createdAt o joinedAt
               if (grupo) {
                   return {
                       ...grupo,
                       createdAt: ug.createdAt,
                       joinedAt: ug.joinedAt
                   };
               }
               return null;
           })
           .filter(grupo => grupo !== null); // Eliminar grupos no encontrados
   
       if (gruposDelUsuario.length === 0) {
           return res.status(200).json({ message: 'No se encontraron grupos asociados a este usuario.' });
       }
       res.json(gruposDelUsuario);
    } catch (err) {
       console.error('Error al obtener los grupos del usuario:', err);
       res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
   });




app.post('/api/grupos/unirse', (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        return res.status(400).json({ message: 'El ID del grupo y el ID del usuario son necesarios' });
    }

    try {
        // Leer los grupos y la relación usuario-grupo
        const grupos = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));

        // Buscar el grupo por ID
        const grupo = grupos.find(g => g.id === groupId);

        if (!grupo) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        // Verificar si el grupo tiene espacio disponible
        if (grupo.currentUsers >= grupo.maxUsers) {
            return res.status(400).json({ message: 'El grupo ya está lleno' });
        }

        // Verificar si el usuario ya está asociado al grupo
        const usuarioYaAsociado = usuarioGrupo.some(ug => ug.userId === parseInt(userId) && ug.groupId === groupId);
        if (usuarioYaAsociado) {
            return res.status(400).json({ message: 'El usuario ya está asociado a este grupo' });
        }

        // Asociar al usuario con el grupo, agregando la fecha actual
        const fechaIngreso = new Date().toISOString(); // Fecha actual en formato ISO
        usuarioGrupo.push({ 
            userId: parseInt(userId), 
            groupId, 
            joinedAt: fechaIngreso 
        });

        // Incrementar el número de usuarios actuales en el grupo
        grupo.currentUsers += 1;

        // Guardar los cambios en los archivos
        fs.writeFileSync(USER_GROUP_FILE, JSON.stringify(usuarioGrupo, null, 2));
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(grupos, null, 2));

        // Enviar la respuesta con el message y el serviceType
        res.status(200).json({
            message: 'Te has unido al grupo correctamente',
            serviceType: grupo.serviceType, // Aquí enviamos el tipo de servicio
           
        });
    } catch (err) {
        console.error('Error al procesar la solicitud de unirse a un grupo:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});






app.get('/api/notificaciones/vencimientos', (req, res) => {
    const suscripciones = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
    const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));
    const notificaciones = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8'));

    const hoy = new Date();

    // Buscar grupos con pagos vencidos o próximos a vencer
    suscripciones.forEach((grupo) => {
        const fechaLimite = new Date(grupo.fechaLimite);
        const diasRestantes = Math.ceil((fechaLimite - hoy) / (1000 * 60 * 60 * 24)); // Diferencia en días

        if (diasRestantes <= 1 && diasRestantes >= 0) { // Dentro de 1 día
            // Buscar usuarios asociados al grupo
            const usuariosEnGrupo = usuarioGrupo.filter(ug => ug.groupId === grupo.id);

            usuariosEnGrupo.forEach((relacion) => {
                // Crear notificación para cada usuario
                const notificacion = {
                    id: notificaciones.length + 1,
                    userId: relacion.userId,
                    groupId: grupo.id,
                    mensaje: `Tu pago para el grupo "${grupo.name}" vence en ${diasRestantes} día(s).`
                };

                notificaciones.push(notificacion);
            });
        }
    });

    // Guardar las notificaciones actualizadas
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notificaciones, null, 2));

    // Aquí devolvemos las notificaciones
    res.json(notificaciones);
});



//Notificaciones forzosas a un dia, PARA PRUEBAS
/*app.get('/api/notificaciones/vencimientos', (req, res) => {
    try {
        // Leer los archivos
        const suscripciones = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));
        const notificaciones = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8'));

        const hoy = new Date();
        let nuevasNotificaciones = [];

        // Enviar notificaciones de prueba sin verificar la fecha límite
        suscripciones.forEach((grupo) => {
            // Usamos una condición falsa para siempre enviar notificaciones
            // Podrías simular un vencimiento en 1 día por ejemplo
            const diasRestantes = 1; // Fuerza el vencimiento para todos los grupos

            // Crear notificaciones para todos los usuarios del grupo
            const usuariosEnGrupo = usuarioGrupo.filter(ug => ug.groupId === grupo.id);

            usuariosEnGrupo.forEach((relacion) => {
                // Verificar si ya existe una notificación para este usuario y grupo
                const existeNotificacion = notificaciones.some(n => n.userId === relacion.userId && n.groupId === grupo.id);
                
                // Si no existe, crear una nueva notificación
                if (!existeNotificacion) {
                    const notificacion = {
                        id: notificaciones.length + 1,
                        userId: relacion.userId,
                        groupId: grupo.id,
                        mensaje: `Prueba: Tu pago para el grupo "${grupo.name}" vence en ${diasRestantes} día(s).`
                    };

                    nuevasNotificaciones.push(notificacion);
                }
            });
        });

        // Si hay nuevas notificaciones, agregarlas al archivo
        if (nuevasNotificaciones.length > 0) {
            // Agregar las nuevas notificaciones al archivo
            const todasNotificaciones = [...notificaciones, ...nuevasNotificaciones];
            fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(todasNotificaciones, null, 2));
        }

        // Devolver las notificaciones al cliente
        res.json(nuevasNotificaciones.length > 0 ? nuevasNotificaciones : notificaciones);
    } catch (error) {
        console.error('Error al procesar las notificaciones:', error);
        res.status(500).json({ message: 'Hubo un error al procesar las notificaciones.' });
    }
});
 */




app.post('/api/pagos/simular', async (req, res) => {
    const { userId, groupId, amount } = req.body;

    try {
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, 
            currency: 'usd',
            description: `Pago del grupo ${groupId} por el usuario ${userId}`,
        });

        // Registrar pago en historial
        const pagos = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf-8'));
        pagos.push({
            id: pagos.length + 1,
            userId,
            groupId,
            amount,
            status: 'success',
            date: new Date().toISOString(),
            paymentIntentId: paymentIntent.id
        });
        fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(pagos, null, 2));

        //
        // Aquí solo se el PaymentIntent sin procesar el pago.

        res.status(200).json({
            message: 'Transacción de pago exitosa',
            clientSecret: paymentIntent.client_secret, // Devolver el clientSecret al frontend
        });
    } catch (err) {
        console.error('Error al realizar el pago:', err);
        res.status(500).json({ message: 'Error al realizar el pago' });
    }
});



// Endpoint para obtener información sobre una película
app.get('/movie/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        // Solicitar información de la película utilizando el ID
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener la información de la película:', error);
        res.status(500).json({ message: 'Error al obtener la información de la película' });
    }
});

// Endpoint para buscar una película por nombre
app.get('/search/movie', async (req, res) => {
    const query = req.query.query; 
    try {
        
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`);
        res.json(response.data);
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        res.status(500).json({ message: 'Error al realizar la búsqueda' });
    }
});


app.post('/api/servicio-suscripcion/guardar', (req, res) => {
    const nuevaSuscripcion = req.body;

    if (!fs.existsSync(SERV_SUB_FILE)) {
        fs.writeFileSync(SERV_SUB_FILE, JSON.stringify([nuevaSuscripcion], null, 2));
    } else {
        const suscripciones = JSON.parse(fs.readFileSync(SERV_SUB_FILE, 'utf-8'));
        suscripciones.push(nuevaSuscripcion);
        fs.writeFileSync(SERV_SUB_FILE, JSON.stringify(suscripciones, null, 2));
    }

    res.json({ message: 'Suscripción guardada exitosamente.' });
});


app.put('/api/servicio-suscripcion/actualizar/:groupId', (req, res) => {
    const { groupId } = req.params;

    try {
        // Leer los archivos
        const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const servicios = JSON.parse(fs.readFileSync(SERV_SUB_FILE, 'utf-8'));

        // Buscar el grupo por su ID en SUBSCRIPTIONS_FILE
        const grupo = subscriptions.find(sub => sub.id === parseInt(groupId));

        if (!grupo) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        // Determinar la disponibilidad del grupo
        const disponibilidad = grupo.currentUsers >= grupo.maxUsers ? 'NO' : 'SI';

       
        const servicioIndex = servicios.findIndex(serv => serv.groupId === parseInt(groupId));

        if (servicioIndex !== -1) {
            servicios[servicioIndex].disponibilidad = disponibilidad;

            fs.writeFileSync(SERV_SUB_FILE, JSON.stringify(servicios, null, 2));
        } else {
            return res.status(404).json({ message: 'Servicio relacionado no encontrado' });
        }

        res.json({
            message: `Disponibilidad actualizada para el grupo ${groupId}`,
            disponibilidad: disponibilidad
        });
    } catch (err) {
        console.error('Error al actualizar disponibilidad:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});


//SALIR DE UN GRUPO SIN RESTRICCIONES
/*app.delete('/api/grupos/salir/:groupId/:userId', (req, res) => {
    const { groupId, userId } = req.params;

    try {
        // Leer los archivos
        const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));

        // Buscar si el usuario está asociado al grupo
        const usuarioIndex = usuarioGrupo.findIndex(
            ug => ug.userId === parseInt(userId) && ug.groupId === parseInt(groupId)
        );

        if (usuarioIndex === -1) {
            return res.status(404).json({ message: 'El usuario no pertenece a este grupo' });
        }

        // Eliminar al usuario del grupo
        usuarioGrupo.splice(usuarioIndex, 1);

        // Actualizar el contador de `currentUsers` en el grupo
        const grupo = subscriptions.find(g => g.id === parseInt(groupId));
        if (grupo) {
            grupo.currentUsers = Math.max(0, grupo.currentUsers - 1); // Evitar negativos
        }

        // Guardar los cambios en los archivos
        fs.writeFileSync(USER_GROUP_FILE, JSON.stringify(usuarioGrupo, null, 2));
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));

        res.status(200).json({ message: 'Has salido del grupo correctamente' });
    } catch (err) {
        console.error('Error al salir del grupo:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});*/


//SALIR DEL GRUPO CON RESTRICCION DE 2 DIAS
app.delete('/api/grupos/salir/:groupId/:userId', (req, res) => {
    const { groupId, userId } = req.params;

    try {
        // Leer los archivos
        const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const usuarioGrupo = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));

        // Buscar la relación usuario-grupo
        const usuarioRelacion = usuarioGrupo.find(
            ug => ug.userId === parseInt(userId) && ug.groupId === parseInt(groupId)
        );

        if (!usuarioRelacion) {
            return res.status(404).json({ message: 'El usuario no pertenece a este grupo' });
        }

        // Verificar si han pasado más de 2 días desde joinedAt
        const fechaUnion = new Date(usuarioRelacion.joinedAt);
        const ahora = new Date();
        const diferenciaDias = (Math.floor((ahora - fechaUnion) / (1000 * 60 * 60 * 24))) * -1; // Diferencia en días
        console.log("diferencia: " + diferenciaDias);

        if (diferenciaDias > 2) {
            return res.status(403).json({
                message: 'No puedes darte de baja porque han pasado más de 2 días desde que te uniste al grupo.'
            });
        }

        // Eliminar al usuario del grupo
        const usuarioIndex = usuarioGrupo.findIndex(
            ug => ug.userId === parseInt(userId) && ug.groupId === parseInt(groupId)
        );
        usuarioGrupo.splice(usuarioIndex, 1);

        // Actualizar el contador de currentUsers en subscriptions
        const grupo = subscriptions.find(g => g.id === parseInt(groupId));
        if (grupo) {
            grupo.currentUsers = Math.max(0, grupo.currentUsers - 1); // Evitar negativos
        }

        // Guardar los cambios en los archivos
        fs.writeFileSync(USER_GROUP_FILE, JSON.stringify(usuarioGrupo, null, 2));
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));

        res.status(200).json({ message: 'Has salido del grupo correctamente.' });
    } catch (err) {
        console.error('Error al salir del grupo:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
});


//DAR DE BAJA UN GRUPO SIN RESTRICCIONES
/*app.delete('/api/grupos/baja/:groupId', (req, res) => {
    const { groupId } = req.params;

    try {
        // Leer los archivos
        const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const userGroups = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));
        const servicios = JSON.parse(fs.readFileSync(SERV_SUB_FILE, 'utf-8'));

        // Convertir groupId a número si es necesario
        const groupIdNum = parseInt(groupId);

        // Verificar si el grupo existe
        const grupo = subscriptions.find(sub => sub.id === groupIdNum);
        if (!grupo) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        // Eliminar el grupo de subscriptions.json
        const nuevasSubscriptions = subscriptions.filter(sub => sub.id !== groupIdNum);

        // Eliminar todas las relaciones del grupo en user_group.json
        const nuevasRelaciones = userGroups.filter(ug => ug.groupId !== groupIdNum);

        // Eliminar la entrada relacionada del archivo SERV_SUB_FILE
        const nuevosServicios = servicios.filter(serv => serv.groupId !== groupIdNum);

        // Guardar los cambios en los archivos
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(nuevasSubscriptions, null, 2));
        fs.writeFileSync(USER_GROUP_FILE, JSON.stringify(nuevasRelaciones, null, 2));
        fs.writeFileSync(SERV_SUB_FILE, JSON.stringify(nuevosServicios, null, 2));

        
        res.status(200).json({ 
            message: `El grupo ${groupId} y todas sus relaciones han sido eliminados correctamente` 
        });
    } catch (err) {
        console.error('Error al dar de baja el grupo:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});
*/


//DAR DE BAJA UN GRUPO CON RESTRICCION de que el grupo solo se puede dar de baja si se ha cumplido la fecha límite
app.delete('/api/grupos/baja/:groupId', (req, res) => {
    const { groupId } = req.params;

    try {
        // Leer los archivos
        const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
        const userGroups = JSON.parse(fs.readFileSync(USER_GROUP_FILE, 'utf-8'));
        const servicios = JSON.parse(fs.readFileSync(SERV_SUB_FILE, 'utf-8'));

        const groupIdNum = parseInt(groupId);

        // Verificar si el grupo existe en subscriptions
        const grupo = subscriptions.find(sub => sub.id === groupIdNum);
        if (!grupo) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        // Comprobar si la fecha actual supera la fecha límite
        const fechaLimite = new Date(grupo.fechaLimite); // Fecha límite en el archivo SUBSCRIPTIONS_FILE
        const fechaActual = new Date();

        if (fechaActual < fechaLimite) {
            return res.status(400).json({
                message: `No se puede dar de baja el grupo hasta la fecha límite: ${fechaLimite.toISOString()}`
            });
        }

        // Eliminar el grupo de subscriptions.json
        const nuevasSubscriptions = subscriptions.filter(sub => sub.id !== groupIdNum);

        // Eliminar todas las relaciones del grupo en user_group.json
        const nuevasRelaciones = userGroups.filter(ug => ug.groupId !== groupIdNum);

        // Eliminar la entrada relacionada del archivo SERV_SUB_FILE
        const nuevosServicios = servicios.filter(serv => serv.groupId !== groupIdNum);

        // Guardar los cambios en los archivos
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(nuevasSubscriptions, null, 2));
        fs.writeFileSync(USER_GROUP_FILE, JSON.stringify(nuevasRelaciones, null, 2));
        fs.writeFileSync(SERV_SUB_FILE, JSON.stringify(nuevosServicios, null, 2));

        res.status(200).json({
            message: `El grupo ${groupId} y todas sus relaciones han sido eliminados correctamente`
        });
    } catch (err) {
        console.error('Error al dar de baja el grupo:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});





// Inicia el servidor en el puerto 3001
app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://0.0.0.0: 3001');
});
