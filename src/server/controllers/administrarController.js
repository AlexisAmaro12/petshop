const pool = require('../../database');
const helpers = require('../../lib/helpers');

exports.index = async (req, res) => {
    res.render('administrar/index');
}

exports.usuarios = async (req, res) => {
    const usuarios = await pool.query('SELECT * FROM users');
    res.render('administrar/usuarios', {usuarios});
}

exports.form = (req, res) => {
    res.render('administrar/add');
}

exports.add = async (req, res) => {
    const { fullname, email, username, password, rol} = req.body;
    const newUsuario= {
        fullname,
        email,
        username,
        password, 
        rol,
    };
    newUsuario.password = await helpers.encryptPassword(password);
    await pool.query('INSERT INTO users set ?', [newUsuario]);
    req.flash('success', 'Usuario agregado correctamente');
    res.redirect('/administrar/usuarios');
}

exports.edit = async (req, res) => {
    const { id } = req.params;
    const usuarios = await pool.query('SELECT * FROM users WHERE ID = ?', [id]);
    res.render('administrar/edit', { usuarios: usuarios[0]});
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { fullname, email, username, password, rol, estado} = req.body;
    if(password == "") {
        const newUsuario= {
            fullname,
            email,
            username,
            rol,
            estado
        };
        req.flash('success', 'Usuario actualizado exitosamente');
        await pool.query('UPDATE users set ? WHERE id = ?', [newUsuario, id]);
        return res.redirect('/administrar/usuarios');
    }
    const newUsuario= {
        fullname,
        email,
        username,
        password, 
        rol,
        estado
    };
    req.flash('success', 'Usuario actualizado exitosamente')
    newUsuario.password = await helpers.encryptPassword(password);
    await pool.query('UPDATE users set ? WHERE id = ?', [newUsuario, id]);
    return res.redirect('/administrar/usuarios');
}

exports.pedidos = async (req, res) => {
    const pedidos = await pool.query('SELECT pedidos.id, users.username, users.fullname, pedidos.costo, pedidos.met_pago, pedidos.pago, pedidos.entrega FROM pedidos, users where pedidos.id_usuario = users.id');
    res.render('administrar/pedidos', { pedidos });
}

exports.editped = async (req, res) => {
    const { id } = req.params;
    const pedidos = await pool.query('SELECT * FROM pedidos WHERE ID = ?', [id]);
    res.render('administrar/editped', { pedidos: pedidos[0]});
}

exports.updateped = async (req, res) => {
    const { id } = req.params;
    const { pago, entrega} = req.body;
    const newPedido= {
        pago,
        entrega
    };
    req.flash('success', 'Pedido actualizado exitosamente')
    await pool.query('UPDATE pedidos set ? WHERE id = ?', [newPedido, id]);
    return res.redirect('/administrar/pedidos');
}

exports.detalles = async (req,res) => {
    const { id } = req.params;
    const detalles = await pool.query('SELECT productos.nombre, detalles.precio, detalles.cantidad from productos, detalles, pedidos WHERE detalles.id_pedido = pedidos.id and detalles.id_producto = productos.id and detalles.id_pedido = ?', [id]);
    console.log(detalles);
    res.render('administrar/detalles', { detalles });
}
