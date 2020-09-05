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
  
  const arguments = process.argv.slice(2);
  const port = parseInt(arguments[0]);

  if (!port || port < 0 || port > 65535) {
    throw new Error(`${arguments[0]} is not a valid port number.`);
  }
  
  server.listen(port, () => {
    console.log('listening on ', port);
  });
  
  module.exports = {
    app,
    server,
    io,
  };