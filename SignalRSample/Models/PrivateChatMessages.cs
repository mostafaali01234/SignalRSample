using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SignalRSample.Models
{
    public class PrivateChatMessages
    {
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        public string? SenderId { get; set; }
        [ForeignKey("SenderId")]
        public IdentityUser? Sender { get; set; }
        public string? ReceiverId { get; set; }
        [ForeignKey("ReceiverId")]

        public IdentityUser? Receiver { get; set; }
        public DateTime Time { get; set; }
        public bool Seen { get; set; }
    }
}
