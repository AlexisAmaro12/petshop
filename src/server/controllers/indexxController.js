const pool = require('../../database');

exports.index = async (req, res) => {
    const productos = await pool.query('SELECT * FROM productos WHERE inicio = "si"');
    res.render('index', {productos});
}

exports.view = async (req, res) => {
    const productos = await pool.query('SELECT * FROM productos WHERE cantidad != 0');
    res.render('productos/list', {productos});
}

exports.categoria = async (req, res) => {
    const {categoria} = req.params;
    const productos = await pool.query('SELECT * FROM productos WHERE cantidad !=0 and categoria = ?', [categoria]);
    if(productos.length == 0) {
        res.redirect('/');
    }
    res.render('productos/list', {productos, categoria});
}