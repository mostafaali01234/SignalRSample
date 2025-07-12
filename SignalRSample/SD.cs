namespace SignalRSample
{
    public static class SD
    {
        static SD()
        {
            DeathlyHallowRace = new Dictionary<string, int>
            {
                { Wand, 0 },
                { Stone, 0 },
                { Cloak, 0 }
            };
        }
        public static string Wand = "wand";
        public static string Stone = "stone";
        public static string Cloak = "cloak";

        public static Dictionary<string, int> DeathlyHallowRace;
    }
}
