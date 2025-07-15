using System.ComponentModel.DataAnnotations;

namespace SignalRSample.Models.ViewModels
{
    public class PublicMessageVm
    {
        public string Message { get; set; }
        public string SenderName { get; set; }
        public string SenderId { get; set; }
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public DateTime Time { get; set; }
    }
}
