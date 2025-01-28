namespace ElectroManage.Application.DTO_s;
public record ListRegisterByCompanyResponse
{
    public double TotalCost { get; set; }
    public double TotalConsumption {  get; set; }
    public IEnumerable<RegisterDTO> Registers { get; set; } = new HashSet<RegisterDTO>();
}