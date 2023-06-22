const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isLoggedIn, isNotLoggedIn } = require('../../lib/authconfig');
//const passport = require('passport');

router.get('/signin', isNotLoggedIn, authController.iniciar);
router.post('/signin', isNotLoggedIn, authController.sesion);

router.get('/signup', isNotLoggedIn, authController.sign);
router.post('/signup', isNotLoggedIn, authController.crear);
/*router.post('/signup', passport.authenticate('local.signup', {
    successRedirect:    '/profile',
    failureRedirect:    '/signup',
    failureFlash:       true
})); ASI PUEDE FUNCIONAR PERO VIOLA LA ESTRUCTURA QUE YA SE TENIA
*/
router.get('/profile', isLoggedIn, authController.profile);
router.get('/pedido/:id', isLoggedIn, authController.detalle);
router.get('/carrito', isLoggedIn, authController.carrito);
router.get('/carrito/agregar/:id', isLoggedIn, authController.agregar);
router.get('/carrito/add/:id', isLoggedIn, authController.add);
router.get('/carrito/quitar/:id', isLoggedIn, authController.quitar);
router.get('/carrito/eliminar/:id', isLoggedIn, authController.eliminar);
router.get('/pago', isLoggedIn, authController.pago);
router.post('/pago', isLoggedIn, authController.pedido);

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});

module.exports = router;