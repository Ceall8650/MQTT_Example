const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const debug = require('debug')('filemanger:server');

// const mqtt = require('mqtt');
const MqttServer = require('./broker.js');
const opt = {
  port: 1883,
  clientId: 'nodejs',
  id: 'mymosca', //在发布时使用的主题命名空间ID $SYS/id 
}
const port = normalizePort(process.env.PORT || '3000')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
// const client = mqtt.connect('tcp:127.0.0.1', opt)

app.use(express.static('www'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a io connection created');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

MqttServer.on('clientConnected', function(client){
  console.log('client connected', client.id);
});

// 客户端断开连接后触发
MqttServer.on('clientDisconnected', function(client) {
  console.log('Client Disconnected:', client.id);
});


// 收到消息后触发
MqttServer.on('published', function(packet, client) {
  console.log('topic :', packet.topic);
  console.log('Published', packet.payload.toString());
  let msg = packet.payload.toString(),
    topic =  packet.topic
  io.emit('mqtt', {topic, msg})
  console.log(`Reciving ${topic} topic. Msg: ${msg.toString()} `);
});

// client.on('connect', () => {
//   console.log(`MQTT Connected!`)
//   client.subscribe({'home/yard/DHT11':1, 'home/kitchen/PIR': 0})
// })

// client.on('message', (topic, msg) => {
  // msg = msg.toString()
  // io.emit('mqtt', {topic, msg})
  // console.log(`Reciving ${topic} topic. Msg: ${msg.toString()} `);
// })

server.listen(port)
server.on('error', onError);
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
