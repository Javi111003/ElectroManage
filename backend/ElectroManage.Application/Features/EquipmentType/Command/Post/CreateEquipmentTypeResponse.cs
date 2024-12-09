namespace ElectroManage.Application.Features.EquipmentType.Command.Post;
public record CreateEquipmentTypeResponse
{
    public long Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public string? Description {get;set;}
    public DateTime Created {get;set;}

}