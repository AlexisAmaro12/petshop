const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const path = require('path')
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session') (session);
const passport = require('passport');
const multer = require('multer');
const { dirname, extname, join } = require('path');

require('dotenv').config();
//Inicializaciones
const app = express();
require('./lib/passport');
const PORT = process.env.PORT || 3000;

//Configuraciones
const MIMETYPES = ['image/jpeg', 'image/png'];
const multerUpload =  multer({
    storage: multer.diskStorage({
        destination: join(path.join(__dirname, 'public/img')),
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];

            cb(null, `${fileName}-${Date.now()}${fileExtension}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Only ${MIMETYPES.join(' ')} mimetypes are allowed`));
    },
    limits: {
        fieldSize: 10000000,
    },
});

module.exports = multerUpload;


app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine( {
    defaultLayout:  'main',
    layoutsDir:     path.join(app.get('views'), 'layouts'),
    partialsDir:    path.join(app.get('views'), 'partials'),
    extname:        '.hbs',
    helpers:        require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

const { database } = {
    database:{
        host            : 'localhost',
        user            : 'root',
        password        : '',
        database        : 'petshop'
    }
};

app.use(session({
    secret:             'faztmysqlnodesession',
    resave:             false,
    saveUninitialized:  false,
    store:              new MySQLStore(database)
}));

//Para los mensajes
app.use(flash());
//Middlewares
//app.use(morgan('dev'));
//Parsing
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));

//Variables Globales (variables que toda la app ocupe).
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Rutas
const auth = require('./server/routes/auth');
const productos = require('./server/routes/productos');
const indexx = require('./server/routes/indexx');
const administrar = require('./server/routes/administrar');

app.use('/', auth);
app.use('/productos', productos);
app.use('/administrar', administrar);
app.use('/', indexx);

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciando el server
app.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`));