using System.ComponentModel.DataAnnotations;

namespace SignalRSample.Models.ViewModels
{
    public class PrivateMessageVm
    {
        public string Message { get; set; }
        public string SenderName { get; set; }
        public string SenderId { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverId { get; set; }
        public DateTime Time { get; set; }
        public bool Seen { get; set; }
    }
}
