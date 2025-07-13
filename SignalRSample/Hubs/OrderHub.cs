using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public class OrderHub : Hub
    {
        private readonly ApplicationDbContext _db;
        public OrderHub(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task SendMessageToAll(string user, string message)
        {
            await Clients.All.SendAsync("MessageReceived", user, message);
        }
        [Authorize]
        public async Task SendMessageToReceiver(string sender, string reveiver, string message)
        {
            var userId = _db.Users.FirstOrDefault(z => z.Email.ToLower() == reveiver.ToLower()).Id;
            if(!string.IsNullOrEmpty(userId))
            {
                await Clients.User(userId).SendAsync("MessageReceived", sender, message);
            }
        }
    }
}
