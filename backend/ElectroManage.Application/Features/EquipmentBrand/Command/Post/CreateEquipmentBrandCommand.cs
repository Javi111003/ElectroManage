namespace ElectroManage.Application.Features.EquipmentBrand.Command.Post;
public record CreateEquipmentBrandCommand : ICommand<CreateEquipmentBrandResponse>
{
    public string Name {get;set;} = string.Empty;
    public string? Description {get;set;}
}