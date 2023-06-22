const pool = require('../../database');

exports.tabla = async (req, res) => {
    const productos = await pool.query('SELECT * FROM productos');
    res.render('productos/tabla', {productos});
}

exports.form = (req, res) => {
    res.render('productos/add');
}

exports.add = async (req, res) => {
    const { nombre, categoria, precio, cantidad, descripcion, inicio} = req.body;
    const newProducto= {
        nombre,
        categoria,
        precio,
        cantidad, 
        descripcion,
        inicio,
        image: req.file.filename
    };
    await pool.query('INSERT INTO productos set ?', [newProducto]);
    req.flash('success', 'Producto agregado correctamente');
    res.redirect('/productos/tabla');
}

exports.edit = async (req, res) => {
    const { id } = req.params;
    const productos = await pool.query('SELECT * FROM productos WHERE ID = ?', [id]);
    res.render('productos/edit', { productos: productos[0]});
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, cantidad, descripcion, inicio} = req.body;
    const newProducto= {
        nombre,
        categoria,
        precio,
        cantidad, 
        descripcion,
        inicio
    };
    req.flash('success', 'Producto actualizado exitosamente')
    await pool.query('UPDATE productos set ? WHERE id = ?', [newProducto, id]);
    res.redirect('/productos/tabla');
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE ID = ?', [id]);
    req.flash('success', "Producto eliminado exitosamente")
    res.redirect('/productos/tabla');
}