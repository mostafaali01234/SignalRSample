var dataTable;
const conncectionOrder = new signalR.HubConnectionBuilder().withUrl("/hubs/order").build();


$(document).ready(function () {
    loadDateTable();
});
function loadDateTable() {
    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/Home/GetAllOrder",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "id", "Width": "5%" },
            { "data": "name", "Width": "15%" },
            { "data": "itemName", "Width": "15%" },
            { "data": "count", "Width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                            <div class="w-75 btn-group" role="group">
                                <a href="" class="btn btn-primary mx-2"><i class="bi bi-pencil-square"></i></a>
                            </div>
                    `;
                },
                "Width": "5%"
            }
        ],
        "language": {
            "emptyTable": "<span class='text-danger'>No orders found.</span>"
        }
    });
}

//-----------------------------------------

// SignalR connection
// SignalR event handlers for order updates and deletions
conncectionOrder.on("newOrder", function () {
    dataTable.ajax.reload();
    toastr.success("New order Received!");
});

//conncectionOrder.on("OrderUpdated", function (order) {
//    var row = dataTable.row(function (idx, data, node) {
//        return data.id === order.id;
//    });
//    if (row.length) {
//        row.data(order).draw();
//    }
//}
//);

//conncectionOrder.on("OrderDeleted", function (orderId) {
//    var row = dataTable.row(function (idx, data, node) {
//        return data.id === orderId;
//    });
//    if (row.length) {
//        row.remove().draw();
//    }
//}
//);
// Start the SignalR connection
function fulfilled() {
    console.log("Connection to HouseGroup hub established.");
}
function rejected() {
    console.error("Connection to HouseGroup hub failed.");
}

conncectionOrder.start().then(fulfilled, rejected);
