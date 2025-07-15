function receivepublicMessage(roomId, userId, username, message) {
    
    let ulmessagesList = document.getElementById(`ulmessagesList${roomId}`);
    let li = document.createElement("li");
    let row = document.createElement("div");
    row.className = "row";
    row.style.margin = 0;
    row.style.padding = 0;


    let newmsg = document.createElement("p");
    newmsg.style.marginBottom = 0;
    if (userId == document.getElementById("hdUserId").value || document.getElementById("hdUserId").value == '') {
        newmsg.innerHTML = `${username}: ${message.message}`;
    }
    else {
        newmsg.innerHTML = `<i role="button" class="bi bi-arrow-right-circle text-primary" onclick="openprivateChat('${userId}','${username}')"> </i> ${username}: ${message.message}`;
    }

    let time = document.createElement("p");
    time.style.fontSize = "0.8rem";
    time.style.color = "grey";
    time.innerText = new Date(message.time).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");


    row.appendChild(newmsg);
    row.appendChild(time);
    li.appendChild(row);
    ulmessagesList.appendChild(li);

    li.scrollIntoView(false);
    li.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

}

//-------------------------------------------

function populateChatRooms(opType) {
    let selectedRoomId = 0;
    $.getJSON("/ChatRooms/GetChatRoom", function (data) {
        let ddlSelRoom = document.getElementById("ulroomTabs");
        let divRooms = document.getElementById("divRooms");
        ulroomTabs.innerHTML = null;
        divRooms.innerHTML = null;

        selectedRoomId = (data[0].id);
        //selectedRoomId = (opType == "Add" ? data[data.length - 1].id : data[0].id);

        data.forEach(item => {
            ddlSelRoom.innerHTML += `
            <li class="nav-item w-25" role="presentation">
                <a class="nav-link text-center ${selectedRoomId == item.id ? "active" : ""}" id="room${item.id}-tab" data-bs-toggle="tab"
                        href="#room${item.id}" role="tab" aria-controls="room${item.id}" aria-selected="true" onclick="LoadRoomMessages(${item.id})">
                   ${item.name} <i class="bi bi-trash text-danger deleteRoom" onclick="deleteRoom(${item.id},'${item.name}')"></i>
                </a>
            </li>
            `;

            divRooms.innerHTML += `
            <div class="tab-pane h-100 fade ${selectedRoomId == item.id ? "show active" : ""}" id="room${item.id}" role="tabpanel" aria-labelledby="room${item.id}-tab">
                <div class="container  h-100" >
                    <div class="row h-100 flex-column p-3">

                        <div class="flex-fill border border-dark rounded" style="overflow:hidden;">
                            <div class="d-block"  style="overflow-y:auto; max-height: 280px">
                                <ul class="p-2" style="list-style-type:none;" id="ulmessagesList${item.id}">

                                </ul>
                            </div>
                        </div>

                        <div class="flex-column">
                            <div class="row py-3">
                                <div class="col-auto">
                                    <label for="inputMessage${item.id}" class="col-form-label">Message</label>
                                </div>
                                <div class="col">
                                    <input type="text" id="inputMessage${item.id}" onkeyup="readypublicMessage(${item.id})" class="form-control">
                                </div>
                                <div class="col-auto">
                                    <button type="button" disabled
                                    id="btnMessage${item.id}"
                                    onclick="sendpublicMessage(${item.id})"
                                    class="btn btn-primary">Send</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            `;
        });
        ddlSelRoom.innerHTML += `
            <li class="nav-item w-25" disabled id="liaddnewRoom" onclick="addnewRoom(4)" role="presentation">
                <a class="nav-link text-center ${data.length = 0 ? "active" : ""} data-bs-toggle="tab"
                        href="#" role="tab" aria-controls="roomAdd" aria-selected="true">
                    <i class="bi bi-plus-lg bg-white text-black px-2"></i>
                </a>
            </li>
            `;
    }).then(() => {
        //console.log(selectedRoomId)
        LoadRoomMessages(selectedRoomId);
    });


    
}


//-------------------------------------------

function populateRoomMessages(roomId, userId, messagesList) {
    
    let ulmessagesList = document.getElementById(`ulmessagesList${roomId}`);
    ulmessagesList.innerHTML = null;


    for (var i = 0; i < messagesList.length; i++) {
        let li = document.createElement("li");
        let row = document.createElement("div");
        row.className = "row";
        row.style.margin = 0;
        row.style.padding = 0;

        let newmsg = document.createElement("p");
        newmsg.style.marginBottom = 0;
        if (messagesList[i].senderId == document.getElementById("hdUserId").value || document.getElementById("hdUserId").value == '') {
            newmsg.innerHTML = `${messagesList[i].senderName}: ${messagesList[i].message}`;
        }
        else {
            newmsg.innerHTML = `<i role="button" class="bi bi-arrow-right-circle text-primary" onclick="openprivateChat('${messagesList[i].senderId}','${messagesList[i].senderName}')"> </i> ${messagesList[i].senderName}: ${messagesList[i].message}`;
        }

        let time = document.createElement("p");
        time.style.fontSize = "0.8rem";
        time.style.color = "grey";
        time.innerText = new Date(messagesList[i].time).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

        row.appendChild(newmsg);
        row.appendChild(time);
        li.appendChild(row);
        ulmessagesList.appendChild(li);

        li.scrollIntoView(false);
        li.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
}


//-------------------------------------------