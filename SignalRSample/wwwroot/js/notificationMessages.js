let btn_send_msg = document.getElementById("btn_send_msg");
let msgInput = document.getElementById("msgInput");
let NotificationCounter = document.getElementById("NotificationCounter");
let NotificationList = document.getElementById("NotificationList");


//-----------------------------------------------

//create connection to the hub
const connectionNotifyMsg = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notifyList", signalR.HttpTransportType.WebSockets).build();

//-----------------------------------------------

connectionNotifyMsg.on("LoadNotification",function (msgs, counter) {
    console.log(11);
    NotificationList.innerHTML = "";
    NotificationCounter.innerHTML = "<span>(" + counter + ")</span>";
    for (let i = msgs.length - 1; i >= 0; i--) {
        var li = document.createElement("li");
        li.textContent = "Notification - " + msgs[i];
        NotificationList.appendChild(li);
    }
});

//-----------------------------------------------

btn_send_msg.addEventListener("click", function (event) {
    connectionNotifyMsg.send("AddNewMessage", msgInput.value).then(function () {
        msgInput.value = "";
    });
    event.preventDefault();
});


//-----------------------------------------------
//start connection
connectionNotifyMsg.start().then(function () {
    connectionNotifyMsg.send("LoadMessages");
    btn_send_msg.disabled = false;
});