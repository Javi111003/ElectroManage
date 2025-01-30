using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;

public record ProyectionNextThreeMonthCommand : ICommand<IEnumerable<ProyectionNextThreeMonthResponse>>
{
    public IEnumerable<long> CompaniesId { get; set; } = new HashSet<long>();
}
