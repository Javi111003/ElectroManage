using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;

public record ProyectionNextThreeMonthCommand : ICommand<IEnumerable<ProyectionDTO>>
{
    public long Id { get; set; }
}
