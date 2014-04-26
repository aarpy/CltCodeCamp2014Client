#!/usr/bin/env node

function createClient(io, name, delayInSecs) {
  // Adding multiple clients
  // http://stackoverflow.com/questions/22713819/socket-io-client-connecting-to-multiple-servers
  var socket = io.connect('http://localhost:9000', { 'force new connection':true });

  socket.on('connect', function() {
    console.info(name + ':socket:connect');

    socket.on('init', function(data) {
      console.info(name + ':socket:init:' + data.username + ':' + data.usercount);

      var delay = Math.floor((Math.random()*1000*delayInSecs)+1) + 1000;
      setTimeout( function() {
        console.info(name + ':socket:message::Hello Code Camp from ' + name + '!');
        socket.emit('message', { content: "Hello Code Camp from " + name + "!" });
      }, delay);
    });
    
    //socket.on('join', function(data) {
    //  console.info(name + ':socket:join:' + data.username + ':' + data.usercount);
    //});
    
    //socket.on('left', function(data) {
    //  console.info(name + ':socket:left:' + data.username + ':' + data.usercount);
    //});
    
    //socket.on('message', function(data) {
    //  console.info(name + ':socket:message:' + data.username + ':' + data.content);
    //});
    
    socket.on('disconnect', function(){
      console.info(name + ':socket:disconnect');
    });

  });
}

var io = require('socket.io-client');

var clientCount = 2;
if (process.argv.length >= 3) {
  clientCount = parseInt(process.argv[2]);
}

var delayInSecs = 5;
if (process.argv.length >= 4) {
  delayInSecs = parseInt(process.argv[3]);
}

console.info('client:clientCount:' + clientCount);
console.info('client:delayInSecs:' +delayInSecs);

for (var i = 1; i <= clientCount; i++) {
  createClient(io, "c" + i, delayInSecs);
};

console.info('client:started');