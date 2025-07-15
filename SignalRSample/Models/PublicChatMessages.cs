using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SignalRSample.Models
{
    public class PublicChatMessages
    {
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        public string? SenderId { get; set; }
        [ForeignKey("SenderId")]
        public IdentityUser? Sender { get; set; }
        public int? RoomId { get; set; }
        [ForeignKey("RoomId")]
        public ChatRoom? ChatRoom { get; set; }
        public DateTime Time { get; set; }
    }
}
