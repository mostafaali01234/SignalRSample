//create connection to the hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connection.on("ReceiverUserConnected", function (userId, userName) {
        AddMessage(`${userName} has a connection open.`);
})

connection.on("ReceiverUserDisconnected", function (userId, userName) {
        AddMessage(`${userName} has closed a connection.`);
})

connection.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    AddMessage(`${userName} has created room ${roomName}.`);
    fillRoomDropDown();
})

connection.on("ReceiveDelRoomMessage", function (deleted, selected, roomName, userName) {
    AddMessage(`${userName} has deleted room ${roomName}.`);
    fillRoomDropDown();
})

connection.on("ReceivePublicMessage", function (roomId, userId, userName, message, roomName) {
    AddMessage(` [Public Message - ${roomName}] ${userName} says ${message}`);
    document.getElementById("txtPublicMessage").value = '';
})

connection.on("ReceivePrivateMessage", function (receiverId, userId, userName, message, receiverName) {
    AddMessage(`[Private Message - ${userName}] ${message}`);
    document.getElementById("txtPrivateMessage").value = '';
})

//-------------------------------------------

function addnewRoom(maxRoom) {
    let createRoomName = document.getElementById("createRoomName");
    let roomName = createRoomName.value;

    if (roomName == null || roomName == '') {
        alert("Please enter a room name.");
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
            createRoomName.value = '';
        },
        error: function (xhr, status, error) {
            AddMessage(`Error creating room: ${error}`);
        }
    });
}

function delRoom() {
    let delRoom = document.getElementById("ddlDelRoom");
    let roomName = delRoom.options[delRoom.selectedIndex].text;
    let delRoomId = delRoom.value;

    let text = `Do you wanr to delete Chat Room ${roomName}?`;
    if (confirm(text) == false)
        return;

    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${delRoomId}`,
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
function sendPublicMessage() {
    let messageBox = document.getElementById("txtPublicMessage");
    let message = messageBox.value;
    let ddlSelRoom = document.getElementById("ddlSelRoom");
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;
    let roomId = ddlSelRoom.value;

    connection.send("SendPublicMessage", Number(roomId), message, roomName);
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
    fillRoomDropDown();
    fillUserDropDown();
})

function fillUserDropDown() {
    $.getJSON("/ChatRooms/GetChatUser", function (data) {
        let ddlSelUser = document.getElementById("ddlSelUser");
        ddlSelUser.innerHTML = null;
        data.forEach(user => {
            let option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.userName;
            ddlSelUser.appendChild(option);
        });
    });
}

function fillRoomDropDown() {
    $.getJSON("/ChatRooms/GetChatRoom", function (data) {
        let ddlSelRoom = document.getElementById("ddlSelRoom");
        let ddlDelRoom = document.getElementById("ddlDelRoom");
        ddlSelRoom.innerHTML = null;
        ddlDelRoom.innerHTML = null;
        data.forEach(user => {
            let option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
            ddlSelRoom.appendChild(option);

            let option1 = document.createElement("option");
            option1.value = user.id;
            option1.textContent = user.name;
            ddlDelRoom.appendChild(option1);
        });
    });
}

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