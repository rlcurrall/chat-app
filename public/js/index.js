// Create socket for connection with server
let socket = io();

// Indicate when user connects
socket.on('connect', function () {
  console.log('Connected to server!');
});

// Indicate when user disconnects
socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

// Display message recieved from server
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

// Display location link recievex from server
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

let messageTextBox = jQuery('[name=message]');

// When form is submitted, don't reload page, send emit message
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('');
  });
});

// Define send-location button
let locationButton = jQuery('#send-location');

// When button clicked get latitude and longitude
locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function (e) {
    locationButton.removeAttr('disabled').text('Send Location');

    alert('Unable to fetch location.');
  });
});
