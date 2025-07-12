var cloakSpan = document.getElementById("cloakCounter");
var stoneSpan = document.getElementById("stoneCounter");
var wandSpan = document.getElementById("wandCounter");


//create connection to the hub
const connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/hubs/deathlyHallows").build();

//connct to methods that hub invokes aka recieve notification from hub
connectionDeathlyHallows.on("updateDeathlyHallowCount", (cloak,stone,wand) => {
    cloakSpan.innerText = cloak;
    stoneSpan.innerText = stone;
    wandSpan.innerText = wand;
});

//invoke hub methods aka send notification to hub


//start connection
function fulfilled() {
    connectionDeathlyHallows.invoke("getRaceStatus").then((raceCounter) => {
        cloakSpan.innerText = raceCounter.cloak;
        stoneSpan.innerText = raceCounter.stone;
        wandSpan.innerText = raceCounter.wand;
    });
    console.log("Connection to DeathlyHallows hub established.");
}
function rejected() {
    console.error("Connection to DeathlyHallows hub failed.");
}
connectionDeathlyHallows.start().then(fulfilled, rejected);