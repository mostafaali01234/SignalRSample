using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Models;
using SignalRSample.Models.ViewModels;

namespace SignalRSample.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Order { get; set; }
    public DbSet<ChatRoom> ChatRoom { get; set; }
    public DbSet<PublicChatMessages> PublicChatMessages { get; set; }
    public DbSet<PrivateChatMessages> PrivateChatMessages { get; set; }
}
