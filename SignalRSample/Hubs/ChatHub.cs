using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using System.Security.Claims;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;
        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
        }

        public override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiverUserConnected", userId, userName);

                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }
        
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if(HubConnections.HasUserConnection(userId, Context.ConnectionId))
            {
                var UserConnections = HubConnections.Users[userId];
                UserConnections.Remove(Context.ConnectionId);
                HubConnections.Users.Remove(userId);

                if(UserConnections.Any())
                    HubConnections.Users.Add(userId, UserConnections);
            }


            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiverUserDisconnected", userId, userName);

                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;

            await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userId, userName);
        }

        public async Task SendDelRoomMessage(int deleted, int selected, string roomName)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;

            await Clients.All.SendAsync("ReceiveDelRoomMessage", deleted, selected, roomName, userName);
        }
        
        public async Task SendPublicMessage(int roomId, string message, string roomName)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;

            await Clients.All.SendAsync("ReceivePublicMessage", roomId, userId, userName, message, roomName);
        }

        public async Task SendPrivateMessage(string receiverId, string message, string receiverName)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;

            await Clients.Users(receiverId, userId).SendAsync("ReceivePrivateMessage", receiverId, userId, userName, message, receiverName);
        }

        public async Task SendOpenPrivateCgat(string receiverId)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;

            await Clients.User(receiverId).SendAsync("ReceiveOpenPrivateChat", userId, userName);
        }
        
        public async Task SendDeletePrivateCgat(string chatId)
        {
            await Clients.All.SendAsync("ReceiveDeletePrivateChat", chatId);
        }
    }
}
