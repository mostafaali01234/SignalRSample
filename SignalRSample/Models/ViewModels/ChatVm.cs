using System.ComponentModel.DataAnnotations;

namespace SignalRSample.Models.ViewModels
{
    public class ChatVm
    {
        public ChatVm()
        {
            Rooms = new List<ChatRoom>();
        }
        public int MaxRoomAllowed { get; set; }
        public IList<ChatRoom> Rooms { get; set; }
        public string? UserId { get; set; }
        public bool AllowAddRoom => Rooms == null || Rooms.Count < MaxRoomAllowed;
    }
}
