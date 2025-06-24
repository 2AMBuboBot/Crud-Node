const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'n0m3l0',
    database:'Crud-Node'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('public'))

// fun agregar

app.post('/agregarUsuario', (req, res) => {
    let nombre = req.body.nombre;
    let id = req.body.id;

    con.query('INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send("Error al conectar");
        }

        return res.send(`<h1>Usuario agregado</h1><p>ID: ${id}</p><p>Nombre: ${nombre}</p>`);
    });
});

app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

//fun consultar


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;

        respuesta.forEach(user => {
            i++;
            userHTML+= `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;


        });

        return res.send(`<table>
                <tr>
                    <th>id</th>
                    <th>Nombre:</th>
                <tr>
                ${userHTML}
                </table>`
        );


    });
});

//fun eliminar 

app.post('/borrarUsuario', (req, res) => {
    const id = req.body.id; // El ID del usuario a eliminar viene en el cuerpo de la solicitud
    console.log("hola")
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});

//fun modificar

app.post('/editarUsuario', (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;

    con.query('UPDATE usuario SET id_usuario = ? WHERE nombre = ?', [id,nombre], (err, resultado) => {
        if (err) {
            console.error('Error al editar el usuario:', err);
            return res.status(500).send("Error al editar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} actualizado correctamente a: ${nombre}`);
    });
});
