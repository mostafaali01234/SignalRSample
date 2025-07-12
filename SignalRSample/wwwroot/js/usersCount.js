//create connection to the hub
const connectionUserCount = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets).build();

//connct to methods that hub invokes aka recieve notification from hub
connectionUserCount.on("UpdateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value;
});
connectionUserCount.on("UpdateTotalUsers", (value) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = value;
});

//invoke hub methods aka send notification to hub

function newWindowLoadedOnClient() {    
    //connectionUserCount.invoke("NewWindowLoadedOnClient").catch(err => console.error(err.toString()));
    connectionUserCount.send("NewWindowLoaded");
}

//start connection
function fulfilled() {
    console.log("Connection to user count hub established.");
    newWindowLoadedOnClient();
}
function rejected() {
    console.error("Connection to user count hub failed.");
}
connectionUserCount.start().then(fulfilled, rejected);