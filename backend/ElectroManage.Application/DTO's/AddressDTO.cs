namespace ElectroManage.Application.DTO_s;

public class AddressDTO
{
    public string Number { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string BeetweenStreets { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string Town { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string Country { get; set; } = "Cuba";
}
