using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListRegistersByCompany;

public record ListRegisterByCompanyResponse
{
    public double TotalCost { get; set; }
    public double TotalConsumption {  get; set; }
    public IEnumerable<RegisterDTO> Registers { get; set; } = new HashSet<RegisterDTO>();
}
