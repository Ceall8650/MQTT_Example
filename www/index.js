$(function () {
  let socket = io()

  socket.on('mqtt', data => {
    console.log('data :', data);
    $('.topic .text').text(data.topic)
    $('.msg .text').text(data.msg.toString())
  })
})