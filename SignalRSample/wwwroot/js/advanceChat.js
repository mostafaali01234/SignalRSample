"use strict";

//create connection to the hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();


//start connection
connection.start().then(function () {
    PopulateMessages();
});

var senderId = document.getElementById("hdUserId").value;

//connection.on("ReceiverUserConnected", function (userId, userName) {
//    AddMessage(`${userName} has a connection open.`);
//})

//connection.on("ReceiverUserDisconnected", function (userId, userName) {
//        AddMessage(`${userName} has closed a connection.`);
//})

connection.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    populateChatRooms("Add");
})

connection.on("ReceiveDelRoomMessage", function (deleted, selected, roomName, userName) {
    populateChatRooms("Delete");
})

connection.on("ReceivePublicMessage", function (roomId, userId, username, message, roomName) {
    receivepublicMessage(roomId, userId, username, message);
})

connection.on("ReceivePrivateMessage", function (receiverId, senderId, senderName, newMessage, receiverName) {
    receiveprivateMessage(receiverId, senderId, senderName, newMessage, receiverName);
})


connection.on("populateRoomMessages", function (roomId, userId, messagesList) {
    populateRoomMessages(roomId, userId, messagesList);
})


connection.on("populatePrivateChat", function (senderId, receiverId, messagesList) {
    populatePrivateChat(senderId, receiverId, messagesList);
})


//document.addEventListener('DOMContentLoaded', (event) => {
//})

//-------------------------------------------

function addnewRoom(maxRoom) {
    let roomName = prompt("ادخل اسم غرفة الدردشة", "");
    if (roomName == null || roomName == '') {
        alert("ادخل اسم صحيح");
        return;
    }

    $.ajax({
        url: "/ChatRooms/PostChatRoom",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (data) {
            connection.invoke("SendAddRoomMessage", maxRoom, data.id, data.name);
            /*connection.invoke("populateRoomMessages", data.id);*/
        },
        error: function (xhr, status, error) {
            AddMessage(`Error creating room: ${error}`);
        }
    });
}

function deleteRoom(roomId, roomName) {
    let text = `هل تريد حذف غرفة الدردشة: ${roomName}؟`;
    if (confirm(text) == false)
        return;
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: "application/json;",
        async: true,
        processData: false,
        cache: false,
        success: function (data) {
            connection.invoke("SendDelRoomMessage", data.deleted, data.selected, roomName);
        },
        error: function (xhr, status, error) {
            AddMessage(`Error creating room: ${error}`);
        }
    });
}


//-------------------------------------------

function setchatuserId(receiverId) {
    console.log(receiverId)
    connection.invoke("populatePrivateChat", senderId, receiverId);
}

//-------------------------------------------

function LoadRoomMessages(roomId) {
    
    connection.invoke("populateRoomMessages", roomId);
}

//-------------------------------------------

function readyprivateMessage() {
    if (document.getElementById("inputMessagePrivate").value === "") {
        document.getElementById('btnMessagePrivate').disabled = true;
    } else {
        document.getElementById('btnMessagePrivate').disabled = false;
    }
}
function readypublicMessage(roomId) {
    if (document.getElementById("inputMessage" + roomId).value === "") {
        document.getElementById('btnMessage' + roomId).disabled = true;
    } else {
        document.getElementById('btnMessage' + roomId).disabled = false;
    }
}

//-------------------------------------------

function sendpublicMessage(roomId) {
    let sendButton = document.getElementById(`btnMessage${roomId}`);
    let inputMsg = document.getElementById(`inputMessage${roomId}`);

    var message = inputMsg.value;
    connection.invoke("SendPublicMessage", roomId, message, "").catch(function (err) {
        inputMsg.value = message;
        sendButton.disabled = false;
        return console.error(err.toString());
    });

    inputMsg.value = '';
    sendButton.disabled = true;
}

//-------------------------------------------

function PopulateMessages() {
    var roomActiveTap = document.querySelector('a.active[id^="room"][id$="-tab"]');
    var rid = roomActiveTap.id.split("-");
    
    connection.send("populateRoomMessages", Number(rid[0].substring(4)));
}


//-------------------------------------------

function sendprivateMessage() {
    let sendButton = document.getElementById(`btnMessagePrivate`);
    let inputMsg = document.getElementById(`inputMessagePrivate`);

    var privateActiveTap = document.querySelector('a.active[id^="list+"][id$="+list"]');
    var rid = privateActiveTap.id.split("+");
    var receiverId = (rid[1]);

    var message = inputMsg.value;
    connection.invoke("SendPrivateMessage", receiverId, message, senderId).catch(function (err) {
        inputMsg.value = message;
        sendButton.disabled = false;
        return console.error(err.toString());
    });

    inputMsg.value = '';
    sendButton.disabled = true;
}


//-------------------------------------------

function AddMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }
    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
}

