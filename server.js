var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];
var ball;
server.listen(8080, function(){
 console.log("Server is now running...");
});
io.on('connection', function(socket){
 console.log("Player Connected!");
 socket.emit('socketID', { id: socket.id });
 socket.emit('getPlayers', players);
 socket.broadcast.emit('newPlayer', { id: socket.id });
 
 socket.on('playerMoved', function(data) {
  data.id = socket.id;
  socket.broadcast.emit('playerMoved', data);
  
  console.log("playerMoved: " +
    "ID: " + data.id +
    "x: " + data.x +
    "y: " + data.y +
    "z: " + data.z +
    "ballVX: " + data.ballVX +
    "ballVY: " + data.ballVY +
    "ballVZ: " + data.ballVZ);
  
  for( var i=0; i<players.length; ++i ) {
   if( players[i].id == data.id ) {
    players[i].x = data.x;
    players[i].y = data.y;
    players[i].z = data.z;
    break;
   }
  }
  if( data.ballVX != '' ) {
   ball.vx = data.ballVX;
   ball.vy = data.ballVY;
   ball.vz = data.ballVZ;
  }
 });
 
 socket.on('disconnect', function() {
  console.log("Player Disconnected");
  socket.broadcast.emit('playerDisconnected', { id: socket.id });
  for( var i = 0; i < players.length; i++ ) {
   if( players[i].id == socket.id ) {
    players.splice(i, 1);
    break;
   }
  }
 });
 players.push( new player(socket.id, 0, 0) );
});
function player(id, x, y, z){
 this.id = id;
 this.x = x;
 this.y = y;
 this.z = z;
}