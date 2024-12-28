using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites;
public class Location : Entity<long>
{
    public string? AddressDetails { get; set; }
    #region Coordinates
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    #endregion
}