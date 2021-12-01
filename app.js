//Notas de la clase

/* Metodos 
app.get(); //peticion
app.post(); //envio de datos
app.put(); //actualizacion
app.delete(); //eliminacion
*/

/*tipo query
app.get('/api/usuarios/:year/:mes',(req,res)=>{
    res.send(req.query);
});*/

//Validacion sencilla
/*if(!req.body.nombre || req.body.nombre.length <= 2){
    //400 Bad Request
    res.status(400).send('Debe ingresar un nombre o un nombre con un minimo de 3 letras');
    return;
};*/

//Inicio de APP

const express = require('express');
const app = express();

const usuarios = require('./routes/usuario')
//const config = require('config');
//const logger = require('./logger');
//const morgan = require('morgan');

//Middlewares
app.use(express.json());
//app.use(logger);
//app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios',usuarios);

//Uso de Middleware de terceros
//app.use(morgan('tiny'));
//console.log('Morgan habilitado....')

//Configuracion de entornos
//console.log('Aplicacion: ' + config.get('nombre'));
//console.log('BD server: ' + config.get('configDB.host'));

//Metodo Get
app.get('/', (req,res)=>{
    res.send('Hello World from Express');
});

//Puerto   
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Escuchando en el puerto ${port}...`)
});