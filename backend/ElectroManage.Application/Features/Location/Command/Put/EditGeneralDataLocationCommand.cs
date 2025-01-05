using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Location.Command.Put;
public record EditGeneralDataLocationCommand : ICommand<LocationDTO> 
{
    public long Id { get; set; }
    public string? AddressDetails { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}