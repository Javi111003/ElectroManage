using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.CostFormula.Command.Delete;

public record DeleteCostFormulaCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
