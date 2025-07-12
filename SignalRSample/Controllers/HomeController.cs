using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Hubs;
using SignalRSample.Models;

namespace SignalRSample.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<DeathlyHallowsHub> _dhHub;

    public HomeController(ILogger<HomeController> logger, IHubContext<DeathlyHallowsHub> dhHub)
    {
        _logger = logger;
        _dhHub = dhHub;
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

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
