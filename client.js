#!/usr/bin/env node

function createClient(io, name) {
  // Adding multiple clients
  // http://stackoverflow.com/questions/22713819/socket-io-client-connecting-to-multiple-servers
  var socket = io.connect('http://localhost:9000', { 'force new connection':true });

  socket.on('connect', function() {
    console.log(name + ':socket:connect');

    socket.on('init', function(data) {
      console.log(name + ':socket:init:' + data.username + ':' + data.usercount);
    });
    
    socket.on('join', function(data) {
      console.log(name + ':socket:join:' + data.username + ':' + data.usercount);

      socket.emit('message', { content: "Hello Code Camp from " + name + "!" });
    });
    
    socket.on('left', function(data) {
      console.log(name + ':socket:left:' + data.username + ':' + data.usercount);
    });
    
    socket.on('message', function(data) {
      console.log(name + ':socket:message:' + data.username + ':' + data.content);
    });
    
    socket.on('event', function(data) {
      console.log(name + ':socket:event:' + data);
    });
    
    socket.on('disconnect', function(){
      console.log(name + ':socket:disconnect');
    });

  });
}

var io = require('socket.io-client');

var clientCount = 2;
if (process.argv.length >= 3) {
  clientCount = parseInt(process.argv[2]);
}
for (var i = 1; i <= clientCount; i++) {
  createClient(io, "c" + i);
};

console.log('client:started');
