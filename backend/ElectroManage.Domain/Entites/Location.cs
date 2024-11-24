using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites;
public class Location : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public string BetweenStreets { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string Town { get; set; } = string.Empty;
    public long ZipCode { get;set; }
    public string Province { get; set; } = string.Empty;
    public string Country { get; set; } = "Cuba";
    public string? Description { get; set; } = string.Empty;
    #region Coordinates
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    #endregion
}