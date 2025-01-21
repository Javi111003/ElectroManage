using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.CostFormula.Query.Get;

public record CostFormulaGetByIdCommand : ICommand<CostFormulaDTO>
{
    public long Id { get; set; }
}