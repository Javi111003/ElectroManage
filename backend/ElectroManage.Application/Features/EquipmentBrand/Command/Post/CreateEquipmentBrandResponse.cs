namespace ElectroManage.Application.Features.EquipmentBrand.Command.Post;
public record CreateEquipmentBrandResponse
{
    public long Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public string? Description {get;set;}
    public DateTime Created {get;set;}

}