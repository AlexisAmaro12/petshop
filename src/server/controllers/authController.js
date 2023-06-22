const pool = require('../../database');
const passport = require('passport');

exports.iniciar = (req, res) => {
    res.render('auth/signin');
}

exports.sesion = (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect:    '/profile',
        failureRedirect:    '/signin',
        failureFlash:       true
    })(req, res, next);
}


exports.sign = (req, res) => {
    res.render('auth/signup');
}

exports.crear = (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect:    '/profile',
        failureRedirect:    '/signup',
        failureFlash:       true
    })(req, res, next);
} 
/*//OPCIONAL NO SERVIA PORQUE NO REGRESABAMOS LA (req, res, next);
exports.crear = (passport.authenticate('local.signup', {
        successRedirect:    '/profile',
        failureRedirect:    '/signup',
        failureFlash:       true
    }));
*/
exports.profile = async (req,res) => {
    const resultado = await pool.query('SELECT rol from users where id = ?', [req.user.id])
    const roles = resultado[0];
    const rol = roles.rol;
    if(rol == "administrador") {
        return res.render('administrar/index');
    }
    const pedidos = await pool.query('SELECT * FROM pedidos WHERE id_usuario = ?', [req.user.id]);
    res.render('profile', { pedidos });
}

exports.detalle = async (req,res) => {
    const { id } = req.params;
    const detalles = await pool.query('SELECT productos.nombre, detalles.precio, detalles.cantidad from productos, detalles, pedidos WHERE detalles.id_pedido = pedidos.id and detalles.id_producto = productos.id and pedidos.id_usuario = ? and detalles.id_pedido = ?', [req.user.id, id]);
    res.render('productos/detalle', { detalles });
}

exports.carrito = async (req,res) => {
    const carrito = await pool.query('SELECT carrito.id, productos.image, users.username, productos.nombre, productos.precio, productos.precio*carrito.cantidad as suma, productos.descripcion, carrito.cantidad FROM users, carrito, productos WHERE carrito.id_usuario = users.id and productos.id = carrito.id_producto and users.id = ?', [req.user.id]);
    const resultado = await pool.query('SELECT SUM(productos.precio*carrito.cantidad) AS suma FROM users, carrito, productos WHERE carrito.id_usuario = users.id and productos.id = carrito.id_producto and users.id = ?', [req.user.id]);
    const primero = resultado[0];
    const total = primero.suma;
    res.render('productos/carrito', { carrito, total });
}

exports.add = async (req,res) => {
    const { id } = req.params;
    const idusuario = req.user.id;
    const carrito = await pool.query('SELECT carrito.id AS idcarrito FROM users, carrito, productos WHERE carrito.id_usuario = users.id and productos.id = carrito.id_producto and users.id = ? and productos.id = ?', [req.user.id, id]);
    if (carrito.length != 0) {
        const existe = carrito[0];
        const resultado = await pool.query('SELECT cantidad FROM carrito WHERE id = ?', [existe.idcarrito])
        const cant = resultado[0];
        const total = 1 + cant.cantidad;
        await pool.query('UPDATE carrito SET cantidad = ? WHERE id = ?', [total, existe.idcarrito]);
        console.log("Sigue vivo");
        return res.redirect('/carrito');
    };
    const newProd = {
        id_usuario: idusuario,
        id_producto: id,
        cantidad: 1
    };
    await pool.query('INSERT INTO carrito set ?', [newProd]);
    res.redirect('/carrito');
}

exports.agregar = async (req,res) => {
    const { id } = req.params;
    const resultado = await pool.query('SELECT cantidad FROM carrito WHERE id = ?', [id])
    const cant = resultado[0];
    const total = 1 + cant.cantidad;
    await pool.query('UPDATE carrito SET cantidad = ? WHERE id = ?', [total, id]);
    res.redirect('/carrito');
}

exports.quitar = async (req,res) => {
    const { id } = req.params;
    const resultado = await pool.query('SELECT cantidad FROM carrito WHERE id = ?', [id])
    const cant = resultado[0];
    const total = cant.cantidad - 1;
    await pool.query('UPDATE carrito SET cantidad = ? WHERE id = ?', [total, id]);
    res.redirect('/carrito');
}

exports.eliminar = async (req,res) => {
    const { id } = req.params;
    console.log(id);
    await pool.query('DELETE FROM carrito WHERE ID = ?', [id]);
    res.redirect('/carrito');
}

exports.pago = async (req, res) => {
    const carrito = await pool.query('SELECT carrito.id, productos.image, users.username, productos.nombre, productos.precio, productos.precio*carrito.cantidad as suma, productos.descripcion, carrito.cantidad FROM users, carrito, productos WHERE carrito.id_usuario = users.id and productos.id = carrito.id_producto and users.id = ?', [req.user.id]);
    const resultado = await pool.query('SELECT SUM(productos.precio*carrito.cantidad) AS suma FROM users, carrito, productos WHERE carrito.id_usuario = users.id and productos.id = carrito.id_producto and users.id = ?', [req.user.id]);
    const primero = resultado[0];
    const total = primero.suma;
    res.render('productos/pago', {carrito, total});
}

exports.pedido = async (req, res) => {
    const { pago, total } = req.body;
    const newPedido = {
        id_usuario: req.user.id,
        met_pago: pago,
        costo: total
    }
    await pool.query('INSERT INTO pedidos set ?', [newPedido]);
    const id_pedido = await pool.query('SELECT id FROM pedidos ORDER BY id DESC LIMIT 1');
    const lastInsertId = id_pedido[0]['id']
    const carrito = await pool.query('SELECT productos.id, productos.precio, carrito.cantidad FROM users, carrito, productos WHERE carrito.id_usuario = users.id and productos.id = carrito.id_producto and users.id = ?', [req.user.id]);
    
    carrito.forEach((rows) => {
        const newDetalle = {
            id_pedido: lastInsertId,
            id_producto: rows.id,
            precio: rows.precio,
            cantidad: rows.cantidad  
        };
        pool.getConnection((err, connection) => {
            if(err) throw err; //No conecta
            pool.query('INSERT INTO detalles set ?', [newDetalle], (err, rows) => {
                //Liberamos la coneccion cuando termina
                connection.release();
                if(!err) {
                } else {
                    console.log(err);
                }
            });
        });
    });
    await pool.query('DELETE FROM carrito WHERE id_usuario = ?', [req.user.id]);
    res.redirect('/profile');
}

exports.logout = (req,res) => {
    req.logOut();
    res.redirect('/sigin');
}