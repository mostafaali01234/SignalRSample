using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRSample.Models;

namespace SignalRSample.Controllers;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<DeathlyHallowsHub> _dhHub;
    private readonly IHubContext<OrderHub> _orderHub;

    public HomeController(ILogger<HomeController> logger, IHubContext<DeathlyHallowsHub> dhHub, ApplicationDbContext db, IHubContext<OrderHub> orderHub)
    {
        _logger = logger;
        _dhHub = dhHub;
        _db = db;
        _orderHub = orderHub;
    }

    public IActionResult Index()
    {
        return View();
    }
    
    public async Task<IActionResult> DeathlyHollows(string type)
    {
        if(SD.DeathlyHallowRace.ContainsKey(type))
        {
            SD.DeathlyHallowRace[type]++;
            await Task.Delay(1000); // Simulate some processing delay
            _logger.LogInformation($"Deathly Hallow {type} collected. Total: {SD.DeathlyHallowRace[type]}");
        }
        else
        {
            _logger.LogWarning($"Invalid Deathly Hallow type: {type}");
            return BadRequest("Invalid Deathly Hallow type.");  
        }

        await _dhHub.Clients.All.SendAsync("updateDeathlyHallowCount"
            , SD.DeathlyHallowRace[SD.Cloak]
            , SD.DeathlyHallowRace[SD.Stone]
            , SD.DeathlyHallowRace[SD.Wand]);
        return Accepted();
    }

    public IActionResult Notification()
    {
        return View();
    }
    
    public IActionResult DeathlyHallowRace()
    {
        return View();
    }
    
    public IActionResult HarryPotterHouse()
    {
        return View();
    }

    public IActionResult Chat()
    {
        return View();
    }
    
    public IActionResult BasicChat()
    {
        return View();
    }

    public async Task<IActionResult> Order()
    {
        string[] name = { "Ahmed", "Mohammed", "Mostafa", "Ali", "Mahmoud" };
        string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

        Random rand = new Random();
        int index = rand.Next(name.Length);

        Order order = new Order
        {
            Name = name[index],
            ItemName = itemName[index],
            Count = index
        };

        return View(order);
    }

    [ActionName("Order")]
    [HttpPost]
    public async Task<IActionResult> OrderPost(Order order)
    {
        _db.Order.Add(order);
        _db.SaveChanges();
        await _orderHub.Clients.All.SendAsync("newOrder");
        return RedirectToAction(nameof(Order));
    }

    [ActionName("OrderList")]
    public async Task<IActionResult> OrderList()
    {
        return View();
    }
    [HttpGet]
    public async Task<IActionResult> GetAllOrder()
    {
        var orders = _db.Order.ToList();
        return Json(new { data = orders });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
