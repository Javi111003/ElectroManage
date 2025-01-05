using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.TopFiveMostConsumption;

public record GetTopFiveMostConsumptionQuery : ICommand<IEnumerable<ConsumptionDTO>>
{
}
