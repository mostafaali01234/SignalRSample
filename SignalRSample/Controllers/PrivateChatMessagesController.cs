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
    public class PrivateChatMessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrivateChatMessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PrivateChatMessages
        [HttpGet]

        [Route("/[controller]/GetPrivateChatMessages")]
        public async Task<ActionResult<IEnumerable<PrivateChatMessages>>> GetPrivateChatMessages(string SenderId, string ReceiverId)
        {
            return await _context.PrivateChatMessages.Where(z => z.SenderId == SenderId && z.ReceiverId == ReceiverId).OrderBy(z => z.Time).ToListAsync();
        }

        // POST: api/PrivateChatMessages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("/[controller]/PostPrivateChatMessages")]
        public async Task<ActionResult<PrivateChatMessages>> PostPrivateChatMessages(PrivateChatMessages privateChatMessages)
        {
            _context.PrivateChatMessages.Add(privateChatMessages);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPrivateChatMessages", new { SenderId = privateChatMessages.SenderId, ReceiverId = privateChatMessages.ReceiverId }, privateChatMessages);
        }

    }
}
