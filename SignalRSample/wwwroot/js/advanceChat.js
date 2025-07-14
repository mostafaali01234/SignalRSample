"use strict";

//create connection to the hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

var senderId = document.getElementById("hdUserId").value;

//connection.on("ReceiverUserConnected", function (userId, userName) {
//        AddMessage(`${userName} has a connection open.`);
//})

//connection.on("ReceiverUserDisconnected", function (userId, userName) {
//        AddMessage(`${userName} has closed a connection.`);
//})

connection.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    //receiveaddnewRoomMessage(maxRoom, roomId, roomName, userId);
    populateChatRooms("Add");
})

connection.on("ReceiveDelRoomMessage", function (deleted, selected, roomName, userName) {
    //AddMessage(`${userName} has deleted room ${roomName}.`);
    populateChatRooms("Delete");
})

connection.on("ReceivePublicMessage", function (roomId, userId, username, message, roomName) {
    receivepublicMessage(roomId, userId, username, message);
})

connection.on("ReceivePrivateMessage", function (senderId, senderName, receiveId, message, chatId) {
    receiveprivateMessage(senderId, senderName, receiveId, message, chatId);
})

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

function sendPrivateMessage() {
    let messageBox = document.getElementById("txtPrivateMessage");
    let message = messageBox.value;
    let ddlSelUser = document.getElementById("ddlSelUser");
    let receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;
    let receiverId = ddlSelUser.value;
    console.log(receiverName);


    connection.send("SendPrivateMessage", (receiverId), message, receiverName);
}

//-------------------------------------------

document.addEventListener('DOMContentLoaded', (event) => {

})


function AddMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }
    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
}

connection.start();