const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { isLoggedIn, isNotLoggedIn } = require('../../lib/authconfig');
const multerUpload = require('../../index');


router.get('/tabla', isLoggedIn, productosController.tabla);
router.get('/add', isLoggedIn, productosController.form);
router.post('/add', multerUpload.single('file'), isLoggedIn, productosController.add);
router.get('/edit/:id', isLoggedIn, productosController.edit);
router.post('/edit/:id', isLoggedIn, productosController.update);
router.get('/delete/:id',  isLoggedIn, productosController.delete);

module.exports = router;