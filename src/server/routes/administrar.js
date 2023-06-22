const express = require('express');
const router = express.Router();
const administrarController = require('../controllers/administrarController');
const { isLoggedIn, isNotLoggedIn } = require('../../lib/authconfig');

router.get('/', isLoggedIn, administrarController.index);
router.get('/usuarios', isLoggedIn, administrarController.usuarios);
router.get('/usuarios/add', isLoggedIn, administrarController.form);
router.post('/usuarios/add', isLoggedIn, administrarController.add);
router.get('/usuarios/edit/:id', isLoggedIn, administrarController.edit);
router.post('/usuarios/edit/:id', isLoggedIn, administrarController.update);
router.get('/pedidos', isLoggedIn, administrarController.pedidos);
router.get('/pedidos/:id', isLoggedIn, administrarController.detalles);
router.get('/pedidos/edit/:id', isLoggedIn, administrarController.editped);
router.post('/pedidos/edit/:id', isLoggedIn, administrarController.updateped);

module.exports = router;