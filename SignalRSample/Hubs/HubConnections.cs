using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public static class HubConnections 
    {
        public static Dictionary<string, List<string>> Users = new();

        public static bool HasUser(string UserId)
        {
            try
            {
                if (Users.ContainsKey(UserId))
                {
                    return Users[UserId].Any();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error checking user connection: {ex.Message}");
            }
            
            return false;
        }
        
        public static bool HasUserConnection(string UserId, string ConnectionId)
        {
            try
            {
                if (Users.ContainsKey(UserId))
                {
                    return Users[UserId].Any(z => z.Contains(ConnectionId));
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error checking user connection: {ex.Message}");
            }
            
            return false;
        }

        public static void AddUserConnection(string UserId, string ConnectionId)
        {
            if(!string.IsNullOrEmpty(UserId) && !HasUserConnection(UserId, ConnectionId))
            {
                if (Users.ContainsKey(UserId))
                    Users[UserId].Add(ConnectionId);
                else
                    Users.Add(UserId, new List<string> { ConnectionId });
            }
        }

        public static List<string> OnlineUsers()
        {
            return Users.Keys.ToList();
        }

    }
}
