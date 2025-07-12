let btn_gry_subbed = document.getElementById("btn_gry_subbed");
let btn_sly_subbed = document.getElementById("btn_sly_subbed");
let btn_huf_subbed = document.getElementById("btn_huf_subbed");
let btn_rav_subbed = document.getElementById("btn_rav_subbed");

let btn_gry_sub = document.getElementById("btn_gry_sub");
let btn_sly_sub = document.getElementById("btn_sly_sub");
let btn_huf_sub = document.getElementById("btn_huf_sub");
let btn_rav_sub = document.getElementById("btn_rav_sub");

let btn_gry_unsub = document.getElementById("btn_gry_unsub");
let btn_sly_unsub = document.getElementById("btn_sly_unsub");
let btn_huf_unsub = document.getElementById("btn_huf_unsub");
let btn_rav_unsub = document.getElementById("btn_rav_unsub");

let btn_gry_notification = document.getElementById("btn_gry_notification");
let btn_sly_notification = document.getElementById("btn_sly_notification");
let btn_huf_notification = document.getElementById("btn_huf_notification");
let btn_rav_notification = document.getElementById("btn_rav_notification");

//-----------------------------------------------

//create connection to the hub
const connectionHouseGroup = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/houseGroup", signalR.HttpTransportType.WebSockets).build();

//-----------------------------------------------

btn_gry_sub.addEventListener("click", function (event) {
    connectionHouseGroup.send("JoinHouse", "Gryffindor");
    event.preventDefault();
});
btn_sly_sub.addEventListener("click", function (event) {
    connectionHouseGroup.send("JoinHouse", "Slytherin");
    event.preventDefault();
});
btn_huf_sub.addEventListener("click", function (event) {
    connectionHouseGroup.send("JoinHouse", "Hufflepuff");
    event.preventDefault();
});
btn_rav_sub.addEventListener("click", function (event) {
    connectionHouseGroup.send("JoinHouse", "Ravenclaw");
    event.preventDefault();
});

//-----------------------------------------------

btn_gry_unsub.addEventListener("click", function (event) {
    connectionHouseGroup.send("LeaveHouse", "Gryffindor");
    event.preventDefault();
});
btn_sly_unsub.addEventListener("click", function (event) {
    connectionHouseGroup.send("LeaveHouse", "Slytherin");
    event.preventDefault();
});
btn_huf_unsub.addEventListener("click", function (event) {
    connectionHouseGroup.send("LeaveHouse", "Hufflepuff");
    event.preventDefault();
});
btn_rav_unsub.addEventListener("click", function (event) {
    connectionHouseGroup.send("LeaveHouse", "Ravenclaw");
    event.preventDefault();
});

//-----------------------------------------------

btn_gry_notification.addEventListener("click", function (event) {
    connectionHouseGroup.send("TriggerHouseNotify", "Gryffindor");
    event.preventDefault();
});
btn_sly_notification.addEventListener("click", function (event) {
    connectionHouseGroup.send("TriggerHouseNotify", "Slytherin");
    event.preventDefault();
});
btn_huf_notification.addEventListener("click", function (event) {
    connectionHouseGroup.send("TriggerHouseNotify", "Hufflepuff");
    event.preventDefault();
});
btn_rav_notification.addEventListener("click", function (event) {
    connectionHouseGroup.send("TriggerHouseNotify", "Ravenclaw");
    event.preventDefault();
});

//-----------------------------------------------

connectionHouseGroup.on("triggerHouseNotification", (houseName) => {
    toastr.success(`A message to all members of house ${houseName}`)
});

//-----------------------------------------------

connectionHouseGroup.on("newMemberAddedToHouse", (houseName) => {
    toastr.success(`Member has Subscriped to ${houseName}`)
});

connectionHouseGroup.on("newMemberRemovedToHouse", (houseName) => {
    toastr.warning(`Member has unSubscriped to ${houseName}`)
});

//-----------------------------------------------

connectionHouseGroup.on("subscriptionStatus", (/*strGroupsJoined,*/ houseName, hasSubscriped) => {
    switch (houseName) {
        case 'slytherin':
            btn_sly_sub.style.display = (hasSubscriped ? "none" : "");
            btn_sly_subbed.style.display = (hasSubscriped ? "" : "none");
            btn_sly_unsub.style.display = (hasSubscriped ? "" : "none");
            break;
        case 'gryffindor':
            btn_gry_sub.style.display = (hasSubscriped ? "none" : "");
            btn_gry_subbed.style.display = (hasSubscriped ? "" : "none");
            btn_gry_unsub.style.display = (hasSubscriped ? "" : "none");
            break;
        case 'hufflepuff':
            btn_huf_sub.style.display = (hasSubscriped ? "none" : "");
            btn_huf_subbed.style.display = (hasSubscriped ? "" : "none");
            btn_huf_unsub.style.display = (hasSubscriped ? "" : "none");
            break;
        case 'ravenclaw':
            btn_rav_sub.style.display = (hasSubscriped ? "none" : "");
            btn_rav_subbed.style.display = (hasSubscriped ? "" : "none");
            btn_rav_unsub.style.display = (hasSubscriped ? "" : "none");
            break;
    }
    toastr.info(hasSubscriped ? `You have Subscriped Successfully. ${houseName}` : `You have unSubscriped Successfully. ${houseName}`)

});

//-----------------------------------------------
//start connection
function fulfilled() {
   
    console.log("Connection to HouseGroup hub established.");
}
function rejected() {
    console.error("Connection to HouseGroup hub failed.");
}
connectionHouseGroup.start().then(fulfilled, rejected);