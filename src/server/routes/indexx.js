const express = require('express');
const router = express.Router();
const productosController = require('../controllers/indexxController');

router.get('/', productosController.index);
router.get('/productos', productosController.view);
router.get('/:categoria', productosController.categoria);

module.exports = router;