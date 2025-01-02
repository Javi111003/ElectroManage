using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.TopFiveMostConsumption;

public record GetTopFiveMostConsumptionResponse
{
    public IEnumerable<ConsumptionDTO> TopFiveMostConsumption { get; set; } = new HashSet<ConsumptionDTO>();
}
