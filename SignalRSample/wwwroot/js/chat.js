var sendMessageBtn = document.getElementById("sendMessage");
var senderEmail = document.getElementById("senderEmail");
var receiverEmail = document.getElementById("receiverEmail");
var chatMessage = document.getElementById("chatMessage");
var messagesList = document.getElementById("messagesList");


//create connection to the hub
const connectionChat = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/hubs/chat").build();

sendMessageBtn.disabled = true;


//connct to methods that hub invokes aka recieve notification from hub
connectionChat.on("MessageReceived", (user, message) => {
    var li = document.createElement("li");
    messagesList.appendChild(li);
    li.textContent = `${user} - ${message}`;

});

//invoke hub methods aka send notification to hub
sendMessageBtn.addEventListener("click", function (event) {
    var sender = senderEmail.value;
    var message = chatMessage.value;
    var receiver = receiverEmail.value;

    if (receiver.length > 0) {
        connectionChat.send("SendMessageToReceiver", sender, receiver, message);
    }
    else {
        connectionChat.send("SendMessageToAll", sender, message);
    }

    event.preventDefault();
});

//start connection
connectionChat.start().then(function () {
    sendMessageBtn.disabled = false;
});