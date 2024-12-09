namespace ElectroManage.Application.Features.EquipmentType.Command.Post;
public record CreateEquipmentTypeCommand : ICommand<CreateEquipmentTypeResponse>
{
    public string Name {get;set;} = string.Empty;
    public string? Description {get;set;}
}