namespace ElectroManage.Application.DTO_s;

public record CompanyGeneralDataDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string InstallationType { get; set; } = string.Empty;
    public decimal ConsumptionLimit { get; set; }
    public string MaganamentTeam { get; set; } = string.Empty;
    public LocationDTO Location { get; set; } = null!;
}
