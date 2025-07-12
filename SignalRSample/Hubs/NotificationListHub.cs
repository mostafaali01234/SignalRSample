using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;

namespace SignalRSample.Hubs
{
    public class NotificationListHub : Hub
    {
        public static List<string> NotificationList { get; private set; } = new List<string>();

        public async Task AddNewMessage(string Msg)
        {
            if(!string.IsNullOrEmpty(Msg))
            {
                NotificationList.Add(Msg);
                await LoadMessages();
            }

        }

        public async Task LoadMessages()
        {
            await Clients.All.SendAsync("LoadNotification", NotificationList, NotificationList.Count);
        }


    }
}
