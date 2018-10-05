const mosca = require('mosca');
const setting = {
  port: 1883,
  url: "127.0.0.1"
}


const server = new mosca.Server(setting)
server.on('ready', () => {
  console.log("MQTT server started!!");
})

module.exports = server