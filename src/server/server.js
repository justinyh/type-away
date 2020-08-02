const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });
  
  app.use(express.static(__dirname + '/../build'));
  
  const server = http.Server(app);
  const io = socketIo(server);
  
  const port = '3030';
  
  server.listen(port, () => {
    console.log('listening on ', port);
  });
  
  module.exports = {
    app,
    server,
    io,
  };