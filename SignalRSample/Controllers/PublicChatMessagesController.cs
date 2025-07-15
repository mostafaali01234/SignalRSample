using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;
using SignalRSample.Models;

namespace SignalRSample.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class PublicChatMessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PublicChatMessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PublicChatMessages
        [HttpGet]
        [Route("/[controller]/GetPublicChatMessages")]
        public async Task<ActionResult<IEnumerable<PublicChatMessages>>> GetPublicChatMessages(int roomId)
        {
            return await _context.PublicChatMessages.Where(z => z.RoomId == roomId).OrderBy(z => z.Time).ToListAsync();
        }


        // POST: api/PublicChatMessages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("/[controller]/PostPublicChatMessages")]
        public async Task<ActionResult<PublicChatMessages>> PostPublicChatMessages(PublicChatMessages publicChatMessages)
        {
            _context.PublicChatMessages.Add(publicChatMessages);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPublicChatMessages", new { roomId = publicChatMessages.RoomId }, publicChatMessages);
        }

    }
}
