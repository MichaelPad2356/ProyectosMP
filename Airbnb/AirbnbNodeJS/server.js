const express = require('express'); //para el NodeJS
const nodemailer = require('nodemailer'); // API para el envio de correos
const bodyParser = require('body-parser'); //Para parsear los datos del bodyParser
const cors = require('cors'); //Para la conexion con Angular

const app = express(); 
const port = 3000; 

app.use(bodyParser.json()); //Para parsear los datos del bodyParserr
app.use(cors()); 

app.post('/reserva', (req, res) => {
    const { fecha, hora, dias, nombre, telefono, email, direccion, limpieza, extraWifi, extraDesayuno, extraParking, precioTotal } = req.body; //Se obtienen los datos del formulario
    
    console.log(`Received contact form data: ${JSON.stringify(req.body)}`); //Impresion para verificar los datos recibidos

    const transporter = nodemailer.createTransport({ // Configuracion del transporte del correo
        host: 'smtp-mail.outlook.com', //Servidor de correo
        port: 587, 
        secure: false, 
        auth: {
          user: 'airbnbWeb@outlook.com', //Correo de envio
          pass: 'Ruben211203' //Contraseña del correo
        },
        tls: {
          rejectUnauthorized: false //Para que no se rechace la conexion
        }
    });

    let mailOptions = {
        from: 'airbnbWeb@outlook.com',
        to: email,
        subject: 'Confirmación de Reserva',
        html: `
            <div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
                <h1 style="color: #ff5a5f;">¡Gracias por tu reserva en Airbnb!</h1>
                <p style="font-size: 16px; color: #333;">Aquí están los detalles de tu reserva:</p>
                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #ff5a5f;">Información de la Reserva</h2>
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Teléfono:</strong> ${telefono}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Dirección:</strong> ${direccion}</p>
                    <p><strong>Fecha de llegada:</strong> ${fecha}</p>
                    <p><strong>Hora de llegada:</strong> ${hora}</p>
                    <p><strong>Días:</strong> ${dias}</p>
                    <p><strong>Servicio de limpieza:</strong> ${limpieza}</p>
                    <p><strong>WiFi extra:</strong> ${extraWifi}</p>
                    <p><strong>Desayuno incluido:</strong> ${extraDesayuno}</p>
                    <p><strong>Estacionamiento:</strong> ${extraParking}</p>
                    <p><strong>Precio Total:</strong> $${precioTotal} MXN</p>
                </div>
                <p style="font-size: 16px; color: #333; margin-top: 20px;">Si tienes alguna pregunta o necesitas modificar tu reserva, no dudes en contactarnos.</p>
                <p style="font-size: 16px; color: #333;">¡Esperamos que disfrutes tu estancia!</p>
                <div style="text-align: center; margin-top: 20px;">
                    <img src="cid:logo" alt="Logo de Airbnb" style="width: 200px; height: auto; display: inline-block;">
                </div>
            </div>
        `,
        attachments: [ 
            {
                filename: 'logo.png',
                path: 'logo.png',
                cid: 'logo' // Identificador para referenciar la imagen en el HTML
            }
        ]
    
    };

    transporter.sendMail(mailOptions, (error, info) => { //Envio del correo
        if (error) { //En caso de error
          console.error(`Error sending email: ${error}`);
          return res.status(500).send('Error sending email');
        }
        console.log(`Email sent: ${info.response}`); //En caso de exito se imprime el mensaje de exito
        res.status(200).send('Contact received and email sent');
    });
});

app.post('/contact', (req,res)=>{
    const {subject, email, description} = req.body;
    console.log(`Received contact form data: ${JSON.stringify(req.body)}`); //Impresion para verificar los datos recibidos
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', //Servidor de correo
        port: 587, 
        secure: false, 
        auth: {
          user: 'airbnbWeb@outlook.com',
          pass: 'Ruben211203'
        },
        tls: {
          rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: 'airbnbWeb@outlook.com',
        to: 'proyectoairbnbweb@gmail.com',
        subject: subject,
        html: `
            <div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
                <h1 style="color: #ff5a5f;">¡Nuevo mensaje de contacto!</h1>
                <p style="font-size: 16px; color: #333;">Aquí está la información del mensaje:</p>
                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mensaje:</strong> ${description}</p>
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error,info)=>{
        if (error){
            console.error(`Error sending email: ${error}`);
            return res.status(500).send('Error sending email');
        }
        console.log(`Email sent: ${info.response}`);
        res.status(200).send('Contact received and email sent');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); //Mensaje de inicio del servidor
});
