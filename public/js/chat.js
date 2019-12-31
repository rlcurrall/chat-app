/* eslint-disable no-undef */

// Create socket for connection with server
let socket = io();

// Auto-scroll page
function scrollToBottom() {
    // Selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (
        clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
        scrollHeight
    ) {
        messages.scrollTop(scrollHeight);
    }
}

// Indicate when user connects
socket.on('connect', function() {
    const params = Qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
    });

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

// Indicate when user disconnects
socket.on('disconnect', function() {
    console.log('Disconnected from server.');
});

socket.on('updateUserList', function(users) {
    let ol = $('<ol></ol');

    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

socket.on('updateUserList', function(users) {
    console.log('Users list', users);
});

// Display message recieved from server
socket.on('newMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        color: message.color,
        createdAt: formattedTime,
    });

    $('#messages').append(html);
    scrollToBottom();
});

// Display location link recievex from server
socket.on('newLocationMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime,
    });

    $('#messages').append(html);
    scrollToBottom();
});

let messageTextBox = $('[name=message]');

// When form is submitted, don't reload page, send emit message
$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit(
        'createMessage',
        {
            from: 'User',
            text: messageTextBox.val(),
            color: userColor,
        },
        function() {
            messageTextBox.val('');
        },
    );
});

// Define send-location button
let locationButton = $('#send-location');

// When button clicked get latitude and longitude
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(
        function(position) {
            locationButton.removeAttr('disabled').text('Send Location');

            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        },
        function() {
            locationButton.removeAttr('disabled').text('Send Location');

            alert('Unable to fetch location.');
        },
    );
});
