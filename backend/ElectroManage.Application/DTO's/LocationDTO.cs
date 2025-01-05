namespace ElectroManage.Application.DTO_s;
public record LocationDTO
{
    public long Id { get; set; }
    public string? AddressDetails { get; set; } = string.Empty;
    public CoordenateDTO CoordenateDTO { get; set; } = null!;
}