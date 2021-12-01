const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Pablo'},
    {id:3, nombre:'Ana'},
];

ruta.get('/',(req,res)=>{
    res.send(usuarios);
});

ruta.get('/:id',(req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('The user searched does not exist');
    res.send(usuario);
});

//Metodo Post
ruta.post('/', (req,res)=>{
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
ruta.put('/:id', (req,res)=>{
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
ruta.delete('/:id',(req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('The user does not exist');
        return;
    }; 
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index,1);

    res.send(usuarios);
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

module.exports = ruta;