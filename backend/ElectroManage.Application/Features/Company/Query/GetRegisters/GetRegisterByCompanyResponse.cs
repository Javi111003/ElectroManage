using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.GetRegisters;

public record GetRegisterByCompanyResponse
{
    public long Id { get; set; }
    public IEnumerable<RegisterDTO> Registers { get; set; } = new HashSet<RegisterDTO>();
}
