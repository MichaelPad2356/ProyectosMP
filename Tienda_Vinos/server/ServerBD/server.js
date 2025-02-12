const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de middleware
app.use(cors()); // Permite solicitudes de otros dominios
app.use(bodyParser.json()); // Para parsear datos JSON

app.use('/uploads', express.static('uploads')); // Carpeta pública para servir imágenes

// Configuración de multer para manejar las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Asegura que el archivo tiene un nombre único
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'imagen') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
});

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tiendaenlinea2'  // Asegúrate de poner el nombre correcto de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});



//Endpoint Login
app.post('/api/login', (req, res) => {
    const { usuario, contraseña } = req.body;
  
    if (!usuario || !contraseña) {
      return res.status(400).json({ success: false, message: 'Por favor ingresa usuario y contraseña.' });
    }
  
    // Consulta para verificar si el usuario existe y si la contraseña es correcta
    const query = 'SELECT * FROM usuario WHERE Nombre = ? AND Contra = ?';
    db.query(query, [usuario, contraseña], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor.' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
      }
  
      // Si el usuario existe y la contraseña es correcta
      const usuarioLogueado = results[0];
      res.status(200).json({
        success: true,
        message: 'Login exitoso.',
        usuario: {
          id: usuarioLogueado.ID_Usuario,
          nombre: usuarioLogueado.Nombre,
          correo: usuarioLogueado.Correo, // Puedes seguir enviando el correo si lo necesitas
        }
      });
    });
  });
  


  // Endpoint para obtener los productos
app.get('/api/productos', (req, res) => {
  //const query = 'SELECT * FROM producto';

  const query = `
  SELECT 
    ID_Producto, 
    Nombre, 
    Descripcion, 
    Precio, 
    Stock, 
    ID_Categoria, 
    URL_Imagen, 
    calcular_descuento(Precio, Stock) AS Precio_Con_Descuento
  FROM 
    producto
`;


  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener los productos.' });
    }

    res.status(200).json({
      success: true,
      productos: results  // Devuelve todos los productos
    });
  });
});


// Endpoint para agregar un nuevo producto
app.post('/api/agregarProducto', upload.single('imagen'), (req, res) => {
  const { Nombre, Descripcion, Precio, Stock, ID_Categoria } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Por favor, selecciona una imagen.' });
  }

  const URL_Imagen = req.file.filename; // Nombre del archivo guardado

  // Query para insertar el producto en la base de datos
  const query = `INSERT INTO producto (Nombre, Descripcion, Precio, Stock, ID_Categoria, URL_Imagen) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [Nombre, Descripcion, Precio, Stock, ID_Categoria, URL_Imagen], (err, result) => {
    if (err) {
      console.error('Error al agregar el producto:', err);
      return res.status(500).json({ success: false, message: 'Error al agregar el producto.' });
    }

    res.status(200).json({
      success: true,
      message: 'Producto agregado correctamente.',
      data: {
        id: result.insertId,
        Nombre,
        Descripcion,
        Precio,
        Stock,
        ID_Categoria,
        URL_Imagen
      }
    });
  });
});

app.get('/api/categorias', (req, res) => {
  const query = 'SELECT DISTINCT ID_Categoria FROM producto';  // Obtiene las categorías únicas

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener las categorías.' });
    }

    res.status(200).json({
      success: true,
      categorias: results  // Devuelve las categorías únicas encontradas en los productos
    });
  });
});


app.put('/api/editarProducto/:id', upload.single('imagen'), (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, Precio, Stock, ID_Categoria, URL_Imagen } = req.body;
  
  // Si no se sube una nueva imagen, mantenemos la URL_Imagen existente
  const imagen = req.file ? req.file.filename : URL_Imagen;

  const query = `UPDATE producto SET Nombre = ?, Descripcion = ?, Precio = ?, Stock = ?, ID_Categoria = ?, URL_Imagen = ? WHERE ID_Producto = ?`;
  db.query(query, [Nombre, Descripcion, Precio, Stock, ID_Categoria, imagen, id], (err, result) => {
    if (err) {
      console.error('Error al editar el producto:', err);
      return res.status(500).json({ success: false, message: 'Error al editar el producto.' });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente.'
    });
  });
});




app.delete('/api/eliminarProducto/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM producto WHERE ID_Producto = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente.'
    });
  });
});

//----------------------------------------------------------------------------------------------------------------------------------------
//---->TABLA USUARIOS<----
// Endpoint para obtener los usuarios
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuario';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
    res.status(200).json(result);
  });
});

// Endpoint para agregar un usuario
app.post('/api/agregarUsuario', (req, res) => {
  const { Nombre, Apellido, Correo, Contra, Tipo, ID_Municipio } = req.body;
  const query = `INSERT INTO usuario (Nombre, Apellido, Correo, Contra, Tipo, ID_Municipio) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [Nombre, Apellido, Correo, Contra, Tipo, ID_Municipio], (err, result) => {
    if (err) {
      console.error('Error al agregar usuario:', err);
      return res.status(500).json({ success: false, message: 'Error al agregar el usuario' });
    }
    res.status(200).json({ success: true, message: 'Usuario agregado correctamente' });
  });
});

// Endpoint para editar un usuario
app.put('/api/editarUsuario/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Correo, Contra, Tipo, ID_Municipio } = req.body;
  const query = `
    UPDATE usuario 
    SET Nombre = ?, Apellido = ?, Correo = ?, Contra = ?, Tipo = ?, ID_Municipio = ?
    WHERE ID_Usuario = ?`;
  
  db.query(query, [Nombre, Apellido, Correo, Contra, Tipo, ID_Municipio, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
    }
    res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
  });
});


// Endpoint para eliminar un usuario
app.delete('/api/eliminarUsuario/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM usuario WHERE ID_Usuario = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar el usuario.' });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente.'
    });
  });
});
//----------------------------------------------------------------------------------------------------------------------------------------------------
//CATEGORIA

// Agregar una nueva categoría
app.post('/api/agregarCategoria', (req, res) => {
  const { Nombre_Categoria } = req.body;

  if (!Nombre_Categoria) {
    return res.status(400).json({ success: false, message: 'El nombre de la categoría es requerido.' });
  }

  const query = `INSERT INTO categoria (Nombre_Categoria) VALUES (?)`;
  db.query(query, [Nombre_Categoria], (err, result) => {
    if (err) {
      console.error('Error al agregar categoría:', err);
      return res.status(500).json({ success: false, message: 'Error al agregar la categoría.' });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría agregada correctamente.'
    });
  });
});


// Obtener todas las categorías
app.get('/api/categorias2', (req, res) => {
  const query = 'SELECT * FROM categoria';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener las categorías.' });
    }

    res.status(200).json(results);
  });
});



// Obtener todas las categorías
app.get('/api/categorias3', (req, res) => {
  const query = 'SELECT ID_Categoria AS id, Nombre_Categoria AS nombre FROM categoria';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener las categorías.' });
    }

    res.status(200).json(results);
  });
});



// Endpoint para editar una categoría
app.put('/api/editarCategoria/:id', (req, res) => {
  const { id } = req.params; // ID de la categoría
  const { Nombre_Categoria } = req.body; // Nuevo nombre de la categoría

  const query = `UPDATE categoria SET Nombre_Categoria = ? WHERE ID_Categoria = ?`;

  db.query(query, [Nombre_Categoria, id], (err, result) => {
    if (err) {
      console.error('Error al editar la categoría:', err);
      return res.status(500).json({ success: false, message: 'Error al editar la categoría.' });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente.'
    });
  });
});



// Endpoint para eliminar una categoría
app.delete('/api/eliminarCategoria/:id', (req, res) => {
  const { id } = req.params; // ID de la categoría a eliminar

  const query = `DELETE FROM categoria WHERE ID_Categoria = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la categoría:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar la categoría.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada correctamente.'
    });
  });
});


//----------------------------------------------------------------------------------------------------------------------------------------------------
//ESTADO


// Endpoint para agregar un nuevo estado
app.post('/api/agregarEstado', (req, res) => {
  const { Nombre_EstadoDirc } = req.body;

  if (!Nombre_EstadoDirc) {
    return res.status(400).json({ success: false, message: 'El nombre del estado es requerido.' });
  }

  const query = `INSERT INTO estado (Nombre_EstadoDirc) VALUES (?)`;

  db.query(query, [Nombre_EstadoDirc], (err, result) => {
    if (err) {
      console.error('Error al agregar el estado:', err);
      return res.status(500).json({ success: false, message: 'Error al agregar el estado.' });
    }

    res.status(200).json({
      success: true,
      message: 'Estado agregado correctamente.'
    });
  });
});


// Endpoint para obtener todos los estados
app.get('/api/estados', (req, res) => {
  const query = 'SELECT * FROM estado'; // Consulta para obtener todos los estados

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los estados:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener los estados.' });
    }

    res.status(200).json(results); // Responder con la lista de estados
  });
});



// Endpoint para editar un estado
app.put('/api/editarEstado/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre_EstadoDirc } = req.body;

  const query = 'UPDATE estado SET Nombre_EstadoDirc = ? WHERE ID_EstadoDirc = ?';
  db.query(query, [Nombre_EstadoDirc, id], (err, result) => {
    if (err) {
      console.error('Error al editar el estado:', err);
      return res.status(500).json({ success: false, message: 'Error al editar el estado.' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Estado actualizado correctamente.' });
    } else {
      res.status(404).json({ success: false, message: 'Estado no encontrado.' });
    }
  });
});



// Endpoint para eliminar un estado
app.delete('/api/eliminarEstado/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM estado WHERE ID_EstadoDirc = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el estado:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar el estado.' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Estado eliminado correctamente.' });
    } else {
      res.status(404).json({ success: false, message: 'Estado no encontrado.' });
    }
  });
});




//-------------------------------------------------------------------------------------------------------------------------------------------------------
//MUNICIPIO
// Endpoint para agregar un municipio
app.post('/api/agregarMunicipio', (req, res) => {
  const { Nombre_Municipio, ID_EstadoDirc } = req.body;

  const query = 'INSERT INTO municipio (Nombre_Municipio, ID_EstadoDirc) VALUES (?, ?)';
  db.query(query, [Nombre_Municipio, ID_EstadoDirc], (err, result) => {
    if (err) {
      console.error('Error al agregar el municipio:', err);
      return res.status(500).json({ success: false, message: 'Error al agregar el municipio.' });
    }

    res.status(200).json({
      success: true,
      message: 'Municipio agregado correctamente.',
    });
  });
});


// Endpoint para obtener todos los municipios
app.get('/api/obtenerMunicipios', (req, res) => {
  const query = 'SELECT m.ID_Municipio, m.Nombre_Municipio, e.Nombre_EstadoDirc AS Estado FROM municipio m JOIN estado e ON m.ID_EstadoDirc = e.ID_EstadoDirc';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener municipios:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener municipios.' });
    }

    res.status(200).json(result);
  });
});


// Endpoint para editar un municipio
app.put('/api/editarMunicipio', (req, res) => {
  const { ID_Municipio, Nombre_Municipio, ID_EstadoDirc } = req.body;

  const query = 'UPDATE municipio SET Nombre_Municipio = ?, ID_EstadoDirc = ? WHERE ID_Municipio = ?';

  db.query(query, [Nombre_Municipio, ID_EstadoDirc, ID_Municipio], (err, result) => {
    if (err) {
      console.error('Error al editar municipio:', err);
      return res.status(500).json({ success: false, message: 'Error al editar el municipio.' });
    }

    res.status(200).json({
      success: true,
      message: 'Municipio actualizado correctamente.'
    });
  });
});



// Endpoint para eliminar un municipio
app.delete('/api/eliminarMunicipio/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM municipio WHERE ID_Municipio = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar municipio:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar el municipio.' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({
        success: true,
        message: 'Municipio eliminado correctamente.'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Municipio no encontrado.'
      });
    }
  });
});


// Endpoint para obtener pedidos con detalles de productos y categorías
app.get('/api/configuracion/pedidos-detalles', (req, res) => {
  const query = `
    SELECT 
      pedido.ID_Pedido,
      pedido.Fecha_Pedido,
      producto.Nombre AS Nombre_Producto,
      producto.Precio,
      detalle_pedido.Cantidad,
      categoria.Nombre_Categoria
    FROM 
      pedido
    INNER JOIN detalle_pedido ON pedido.ID_Pedido = detalle_pedido.ID_Pedido
    INNER JOIN producto ON detalle_pedido.ID_Producto = producto.ID_Producto
    INNER JOIN categoria ON producto.ID_Categoria = categoria.ID_Categoria
    ORDER BY 
      pedido.Fecha_Pedido DESC;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos con detalles:', err);
      return res.status(500).send('Error al obtener pedidos con detalles');
    }
    res.json(results);
  });
});

// Endpoint para obtener pagos con detalles del usuario y estado de envío
app.get('/api/configuracion/pagos-detalles', (req, res) => {
  const query = `
    SELECT 
      pago.ID_Pago,
      pago.Fecha_Pago,
      pago.Monto,
      pago.Metodo_Pago,
      usuario.Nombre AS Nombre_Usuario,
      usuario.Apellido AS Apellido_Usuario,
      envio.Estado_Envio
    FROM 
      pago
    INNER JOIN pedido ON pago.ID_Pedido = pedido.ID_Pedido
    INNER JOIN usuario ON pedido.ID_Usuario = usuario.ID_Usuario
    LEFT JOIN envio ON envio.ID_Pedido = pedido.ID_Pedido
    ORDER BY 
      pago.Fecha_Pago DESC;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener pagos con detalles:', err);
      return res.status(500).send('Error al obtener pagos con detalles');
    }
    res.json(results);
  });
});



//*************************************************************************************************************************** */
// Ruta para ejecutar el procedimiento almacenado
app.get('/actualizar-envio', (req, res) => {
  const query = 'CALL actualizar_estado_pedido();';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error ejecutando el procedimiento:', err);
          res.status(500).send('Error al actualizar el estado del envío');
          return;
      }

      console.log('Resultado de la ejecución del procedimiento:', results);
      res.send('Estados de envío actualizados');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


//******************************************************************************************************************************************* */
//Enpoints CARRITO

// Endpoint para actualizar el stock del producto
app.put('/api/productos/:productoId', (req, res) => {
  const { productoId } = req.params;  // Obtenemos el ID del producto de la URL
  const { stock } = req.body;         // Obtenemos el nuevo stock desde el cuerpo de la solicitud

  if (!productoId || stock == undefined) {
    return res.status(400).json({ success: false, message: 'Producto ID o stock no válidos.' });
  }

  // Actualizar el stock del producto en la base de datos
  const query = 'UPDATE producto SET Stock = ? WHERE ID_Producto = ?';
  db.query(query, [stock, productoId], (err, result) => {
    if (err) {
      console.error('Error al actualizar el stock:', err);
      return res.status(500).json({ success: false, message: 'Error al actualizar el stock.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Stock actualizado correctamente.' });
  });
});

// Endpoint para agregar un producto al carrito
app.post('/api/carrito', (req, res) => {
  const { usuarioId, productoId, cantidad } = req.body;

  if (!usuarioId || !productoId || !cantidad) {
    return res.status(400).json({ success: false, message: 'Faltan datos para agregar al carrito.' });
  }

  // Primero verificamos si el usuario ya tiene un carrito activo
  // Primero verificamos si el usuario ya tiene un carrito activo
  db.query('SELECT * FROM carrito WHERE ID_Usuario = ?', [usuarioId], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }

    let carritoId;

    if (results.length > 0) {
      // Si el carrito existe, usamos su ID
      carritoId = results[0].ID_Carrito;
      // Agregamos el producto al detalle del carrito
      agregarProductoAlCarrito(carritoId);
    } else {
      // Si no existe, creamos uno nuevo
      db.query('INSERT INTO carrito (ID_Usuario, Fecha_Creacion) VALUES (?, NOW())', [usuarioId], (err, result) => {
        if (err) {
          console.error('Error al crear carrito:', err);
          return res.status(500).json({ success: false, message: 'Error al crear carrito.' });
        }
        carritoId = result.insertId;
        // Ahora que se creó el carrito, agregamos el producto
        agregarProductoAlCarrito(carritoId);
      });
    }

    // Función para agregar el producto al carrito
    function agregarProductoAlCarrito(carritoId) {
      db.query('INSERT INTO detalle_carrito (ID_Carrito, ID_Producto, Cantidad) VALUES (?, ?, ?)', [carritoId, productoId, cantidad], (err, result) => {
        if (err) {
          console.error('Error al agregar producto al carrito:', err);
          return res.status(500).json({ success: false, message: 'Error al agregar producto al carrito.' });
        }
        res.status(200).json({ success: true, message: 'Producto agregado al carrito correctamente.' });
      });
    }
  });
});

// Endpoint para agregar productos al carrito
app.post('/api/carrito/agregar', (req, res) => {
  const { carritoId, productoId, cantidad } = req.body;

  if (!carritoId || !productoId || !cantidad) {
    return res.status(400).json({ success: false, message: 'Faltan datos (carritoId, productoId, cantidad).' });
  }

  // Verificar si el producto ya está en el carrito
  const queryCheck = 'SELECT * FROM detalle_carrito WHERE ID_Carrito = ? AND ID_Producto = ?';
  db.query(queryCheck, [carritoId, productoId], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error al verificar el producto.' });
    }

    if (results.length > 0) {
      // Si el producto ya existe, actualizamos la cantidad
      const queryUpdate = 'UPDATE detalle_carrito SET Cantidad = ? WHERE ID_Carrito = ? AND ID_Producto = ?';
      db.query(queryUpdate, [cantidad, carritoId, productoId], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar el producto:', err);
          return res.status(500).json({ success: false, message: 'Error al actualizar el producto en el carrito.' });
        }

        res.status(200).json({
          success: true,
          message: 'Producto actualizado en el carrito.',
        });
      });
    } else {
      // Si el producto no existe, lo insertamos
      const queryInsert = 'INSERT INTO detalle_carrito (ID_Carrito, ID_Producto, Cantidad) VALUES (?, ?, ?)';
      db.query(queryInsert, [carritoId, productoId, cantidad], (err, insertResults) => {
        if (err) {
          console.error('Error al agregar el producto:', err);
          return res.status(500).json({ success: false, message: 'Error al agregar el producto al carrito.' });
        }

        res.status(200).json({
          success: true,
          message: 'Producto agregado al carrito.',
        });
      });
    }
  });
});

// Endpoint para obtener el contenido del carrito
app.get('/api/carrito/:carritoId', (req, res) => {
  const { carritoId } = req.params;

  const query = `
    SELECT p.ID_Producto, p.Nombre, p.Descripcion, p.Precio, dc.Cantidad
    FROM detalle_carrito dc
    JOIN producto p ON dc.ID_Producto = p.ID_Producto
    WHERE dc.ID_Carrito = ?
  `;

  db.query(query, [carritoId], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener el contenido del carrito.' });
    }

    res.status(200).json({
      success: true,
      productos: results,
    });
  });
});


//********************************************************************************************************************************** */
//EJECUCION DEL PROCEDIMIENTO 1
// Endpoint para obtener las ventas por categoría
app.get('/api/ventas-por-categoria', (req, res) => {
  console.log('Solicitud recibida a /api/ventas-por-categoria');
  console.log('Query parameters:', req.query);

  const { fechaInicio, fechaFin } = req.query;

  // Validación de parámetros
  if (!fechaInicio || !fechaFin) {
    console.log('Fechas faltantes');
    return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
  }

  // Llamada al procedimiento almacenado
  const query = 'CALL InformeVentasPorCategoria(?, ?)';
  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ 
        error: 'Hubo un error al ejecutar la consulta',
        details: err.message 
      });
    }

    console.log('Resultados obtenidos:', results);

    // Reformateo de resultados si es necesario
    const datos = results[0].map((fila) => ({
      categoria: fila.Nombre_Categoria,
      totalVentas: fila.TotalVentas,
      promedioVentas: fila.PromedioVentasPorPedido
    }));

    res.json(datos); 
  });
});


app.get('/api/union-productos', (req, res) => {
  console.log('Solicitud recibida a /api/union-productos');
  console.log('Query parameters:', req.query);

  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    console.log('Fechas faltantes');
    return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
  }

  // Llamada al procedimiento almacenado
  const query = 'CALL InformeUnionProductos(?, ?)';
  
  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({
        error: 'Hubo un error al ejecutar la consulta',
        details: err.message
      });
    }

    console.log('Resultados obtenidos:', results);
    res.json(results[0]); // Devolvemos la primera parte del resultado
  });
});



    //************************************************************************************************************************* */
    app.get('/api/contar/:idCategoria', (req, res) => {
      const { idCategoria } = req.params;
  
      // Validation
      if (!idCategoria) {
          return res.status(400).json({ error: 'Se requiere el parámetro idCategoria.' });
      }
  
      // Query to count products
      const query = `SELECT contar_productos_categoria(?) AS cantidad`;
  
      // Execute query
      db.query(query, [idCategoria], (err, results) => {
          if (err) {
              console.error('Error al ejecutar la consulta', err);
              return res.status(500).json({ error: 'Hubo un error al ejecutar la consulta.' });
          }
  
          // Respond with product count
          res.json({ cantidad: results[0].cantidad });
      });
  });


  //********************************************************************************************************************* */
  // Ruta para obtener los pedidos completos desde la vista
app.get('/api/pedidos', (req, res) => {
  const query = 'SELECT * FROM vista_pedidos_completa'; // Consulta la vista directamente

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la vista:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener los pedidos completos.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      pedidos: results // Devuelve los pedidos obtenidos de la vista
    });
  });
});



// Endpoint para obtener productos más vendidos
app.get('/api/productos-mas-vendidos', (req, res) => {
  const query = 'SELECT * FROM productos_mas_vendidos';  // Usando la vista con los productos más vendidos

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos más vendidos:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener productos más vendidos.' 
      });
    }
    
    // Devolver resultados con un formato compatible
    res.status(200).json({ 
      success: true,
      productos: results
    });
  });
});



// Endpoint para obtener categorías con ventas mayores a 5000
app.get('/api/categorias-mas-vendidas', (req, res) => {
  const query = `
    SELECT p.ID_Categoria, SUM(dp.Cantidad * dp.Precio_Unitario) AS Total_Ventas
    FROM detalle_pedido dp
    JOIN producto p ON dp.ID_Producto = p.ID_Producto
    GROUP BY p.ID_Categoria
    HAVING SUM(dp.Cantidad * dp.Precio_Unitario) > 5000
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las categorías más vendidas:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener las categorías más vendidas.' });
    }

    // Enviar respuesta con los resultados
    res.status(200).json({ success: true, categorias: results });
  });
});

// Vista de stock por categoría
app.get('/api/reportes/stock-categoria', (req, res) => {
  const query = 'SELECT * FROM Vista_Stock_Categoria';  // Consulta SQL
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al obtener datos.' });
    }
    res.status(200).json({ success: true, stock: results });
  });
});

//********************************************************************************************************************************* */

// Endpoint para obtener ventas con ROLLUP
app.get('/api/ventas/rollup', (req, res) => {
  const query = `
    SELECT COALESCE(c.Nombre_Categoria, 'TOTAL') AS Nombre_Categoria, 
           COALESCE(pd.Fecha_Pedido, 'TOTAL') AS Fecha_Pedido, 
           SUM(dp.Cantidad * dp.Precio_Unitario) AS Total_Ventas 
    FROM detalle_pedido dp 
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto 
    INNER JOIN categoria c ON p.ID_Categoria = c.ID_Categoria 
    INNER JOIN pedido pd ON dp.ID_Pedido = pd.ID_Pedido 
    GROUP BY c.Nombre_Categoria, pd.Fecha_Pedido WITH ROLLUP
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener ventas con ROLLUP:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener ventas con ROLLUP.' 
      });
    }
    
    // Devolver resultados con un formato compatible
    res.status(200).json({ 
      success: true,
      ventasRollup: results
    });
  });
});



app.get('/api/usuarios/top-compras-cube', (req, res) => {
  const query = `
    SELECT 
      COALESCE(u.ID_Usuario, 'TOTAL') AS ID_Usuario,
      COALESCE(u.Nombre, 'TOTAL') AS Nombre_Usuario,
      COUNT(p.ID_Pedido) AS Total_Compras,
      SUM(dp.Cantidad * dp.Precio_Unitario) AS Total_Ventas
    FROM pedido p
    INNER JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
    INNER JOIN detalle_pedido dp ON p.ID_Pedido = dp.ID_Pedido
    GROUP BY u.ID_Usuario, u.Nombre
    ORDER BY Total_Compras DESC

  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios top:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener usuarios top.' 
      });
    }
    
    // Filtrar el resultado para obtener el top de usuarios y el total general
    const usuariosTop = results.filter(
      result => result.ID_Usuario !== 'TOTAL'
    ).slice(0, 5); // Top 5 usuarios

    const totalGeneral = results.find(
      result => result.ID_Usuario === 'TOTAL'
    );

    res.status(200).json({ 
      success: true,
      usuariosTop: usuariosTop,
      totalGeneral: totalGeneral
    });
  });
});

//************************************************************************************************************************** */
app.get('/api/union-productos', (req, res) => {
  console.log('Solicitud recibida a /api/union-productos');
  console.log('Query parameters:', req.query);

  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    console.log('Fechas faltantes');
    return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
  }

  // Llamada al procedimiento almacenado
  const query = 'CALL InformeUnionProductos(?, ?)';
  
  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({
        error: 'Hubo un error al ejecutar la consulta',
        details: err.message
      });
    }

    console.log('Resultados obtenidos:', results);
    res.json(results[0]); // Devolvemos la primera parte del resultado
  });
});


/*app.get('/api/ventas-por-categoria', (req, res) => {
  console.log('Solicitud recibida a /api/ventas-por-categoria');
  console.log('Query parameters:', req.query);

  const { fechaInicio, fechaFin } = req.query;

  // Validación de parámetros
  if (!fechaInicio || !fechaFin) {
    console.log('Fechas faltantes');
    return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
  }

  // Llamada al procedimiento almacenado
  const query = 'CALL InformeVentasPorCategoria(?, ?)';
  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ 
        error: 'Hubo un error al ejecutar la consulta',
        details: err.message 
      });
    }

    console.log('Resultados obtenidos:', results);

    // Reformateo de resultados si es necesario
    const datos = results[0].map((fila) => ({
      categoria: fila.Nombre_Categoria,
      totalVentas: fila.TotalVentas,
      promedioVentas: fila.PromedioVentasPorPedido
    }));

    res.json(datos); 
  });
});*/