const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-uzfys.mongodb.net/semana09?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

const connectedUsers = {};

io.on('connection', socket => {
    const {user_id} = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);

//MÉTODOS : get, post, put (editar), delete

//req.query = Acessar query params (para filtros)
//  app.get('/users', (req,res) => {
//      return res.json({idade: req.query.idade});
//  })

//req.params = Acessar route params (para edição, delete)
//  app.put('/users/:id', (req,res) => {
//      return res.json({id: req.params.id});
//  })

//req.body = Acessar corpo da requisição (para criação, edição)
//      app.use(express.json());
//  app.post('/users', (req,res) => {
//      return res.json(req.body);
//  })