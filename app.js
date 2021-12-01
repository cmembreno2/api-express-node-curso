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
const Joi = require('joi');
//const config = require('config');
//const logger = require('./logger');
//const morgan = require('morgan');

//Middlewares
app.use(express.json());
//app.use(logger);
//app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Uso de Middleware de terceros
//app.use(morgan('tiny'));
//console.log('Morgan habilitado....')

//Configuracion de entornos
//console.log('Aplicacion: ' + config.get('nombre'));
//console.log('BD server: ' + config.get('configDB.host'));

const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Pablo'},
    {id:3, nombre:'Ana'},
];

//Metodo Get
app.get('/', (req,res)=>{
    res.send('Hello World from Express');
});

app.get('/api/usuarios',(req,res)=>{
    res.send(usuarios);
});

app.get('/api/usuarios/:id',(req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('The user searched does not exist');
    res.send(usuario);
});

//Metodo Post
app.post('/api/usuarios', (req,res)=>{
    //Aplicando middleware  url encoded
    /*let body = req.body;
    console.log(body.nombre);
    res.json({
        body
    })*/
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    const {error,value}= validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
    };
});

//Metodo Put
app.put('/api/usuarios/:id', (req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('The user does not exist');
        return;
    }; 
    //Validacion 
    const {error,value}= validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre = value.nombre;
    res.send(usuario);
});

//Metodo Delete
app.delete('/api/usuarios/:id',(req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('The user does not exist');
        return;
    }; 
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index,1);

    res.send(usuarios);
});

//Puerto   
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Escuchando en el puerto ${port}...`)
});

//Funciones de validacion

function existeUsuario(id){
    return(usuarios.find(u => u.id === parseInt(id)));
};

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return schema.validate({ nombre: nom});
}