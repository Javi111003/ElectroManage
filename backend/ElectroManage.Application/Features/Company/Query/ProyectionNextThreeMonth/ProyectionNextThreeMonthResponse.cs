using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;

public record ProyectionNextThreeMonthResponse
{
    public long CompanyId { get; set; }
    public IEnumerable<ProyectionDTO> Proyections { get; set; } = new HashSet<ProyectionDTO>();
}
