using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public record CreateEfficienciPolicyCommand : ICommand<EfficiencyPolicyDTO>
{
    public required string Name { get; set; } 
    public string? Description { get; set; }
}
