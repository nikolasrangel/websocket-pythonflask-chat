/* Using the reconnecting-websocket library to automatically reconnect any disrupted connections in the browser */

// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:")
    var ws_scheme = "wss://";
else
    var ws_scheme = "ws://"
  
var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

/* Function which aims to handle receive messages from server */
inbox.onmessage = function(message) {
    var data = JSON.parse(message.data);
    $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + $('<span/>').text(data.handle).html() + "</div><div class='panel-body'>" + $('<span/>').text(data.text).html() + "</div></div>");
    $("#chat-text").stop().animate({
      scrollTop: $('#chat-text')[0].scrollHeight
    }, 800);
};

/* Function which aims to send messages to server */
$("#input-form").on("submit", function(event) {
    /* Stop the form from actually sending a POST to the form */
    event.preventDefault();
    /* Grab the values from the form and send them as a JSON message */
    var handle = $("#input-handle")[0].value;
    var text   = $("#input-text")[0].value;
    outbox.send(JSON.stringify({ handle: handle, text: text }));
    $("#input-text")[0].value = ""; // Clean the message box
});