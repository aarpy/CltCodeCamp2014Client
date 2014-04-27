#!/usr/bin/env node

function createClient(name, url, io, messagesDuration, messagesPerConn) {
  // Adding multiple clients
  // http://stackoverflow.com/questions/22713819/socket-io-client-connecting-to-multiple-servers
  var socket = io.connect(url, { 'force new connection':true });
  if (!socket) {
    console.log('failed to create socket: ' + name);
    return;
  }

  socket.on('connect', function() {
    //console.info(name + ':socket:connect');

    socket.on('init', function(data) {
      console.info(name + ':socket:init:' + data.username + ':' + data.usercount);
      sendMessages(name, socket, messagesDuration, messagesPerConn);
      closeSocket(name, socket, messagesDuration);
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

function sendMessages(name, socket, messagesDuration, messagesPerConn) {
  for (var i = 1; i <= messagesPerConn; i++) {
    var delay = Math.floor((Math.random()*1000*messagesDuration)+1);
    setTimeout( function(counter) {
      var content = 'Hello Code Camp from ' + name + ' - ' + counter + '!';
      console.info(name + ':socket:message::' + content);
      socket.emit('message', { content:  content});
    }, delay, i);
  };
}

function closeSocket(name, socket, messagesDuration) {
    setTimeout( function() { socket.disconnect(); }, messagesDuration*1000 + 1000);
}

function main() {
  console.info('node client.js <url> <clientCount> <messagesDuration> <messagesPerConn>');
  
  var io = require('socket.io-client');

  var url = 'http://localhost:9000';
  if (process.argv.length >= 3) {
    url = process.argv[2];
  }

  var clientCount = 2;
  if (process.argv.length >= 4) {
    clientCount = parseInt(process.argv[3]);
  }

  var messagesDuration = 5;
  if (process.argv.length >= 5) {
    messagesDuration = parseInt(process.argv[4]);
  }

  var messagesPerConn = 3;
  if (process.argv.length >= 6) {
    messagesPerConn = parseInt(process.argv[5]);
  }

  console.info('node client.js ' + url + ' ' + clientCount + ' ' + messagesDuration + ' ' + messagesPerConn);

  for (var i = 1; i <= clientCount; i++) {
    createClient("Bot" + i, url, io, messagesDuration, messagesPerConn);
  };

  console.info('client:started');
}

//invoke main
main();
