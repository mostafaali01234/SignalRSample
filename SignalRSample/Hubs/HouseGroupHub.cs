using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class HouseGroupHub : Hub
    {
        public static List<string> GroupsJoined { get; private set; } = new List<string>();

        public async Task TriggerHouseNotify(string HouseName)
        {
            await Clients.Group(HouseName).SendAsync("triggerHouseNotification", HouseName.ToLower());
        }

        public async Task JoinHouse(string HouseName)
        {
            if (!GroupsJoined.Contains(Context.ConnectionId + ":" + HouseName))
            {
                GroupsJoined.Add(Context.ConnectionId + ":" + HouseName);

                await Clients.Caller.SendAsync("subscriptionStatus", HouseName.ToLower(), true);
                await Clients.OthersInGroup(HouseName).SendAsync("newMemberAddedToHouse", HouseName.ToLower());

                await Groups.AddToGroupAsync(Context.ConnectionId, HouseName);
            }
        }

        public async Task LeaveHouse(string HouseName)
        {
            if (GroupsJoined.Contains(Context.ConnectionId + ":" + HouseName))
            {
                GroupsJoined.Remove(Context.ConnectionId + ":" + HouseName);
                
                await Clients.Caller.SendAsync("subscriptionStatus", HouseName.ToLower(), false);
                await Clients.OthersInGroup(HouseName).SendAsync("newMemberRemovedToHouse", HouseName.ToLower());

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, HouseName);
            }
        }

    }
}
