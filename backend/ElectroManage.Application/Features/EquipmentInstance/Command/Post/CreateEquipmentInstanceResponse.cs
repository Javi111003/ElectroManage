namespace ElectroManage.Application.Features.EquipmentInstance.Command.Post;
public record CreateEquipmentInstanceResponse
{
    public long Id {get;set;}
    public DateTime InstalationDate { get; set; }
    public string MantainceStatus { get; set; } = string.Empty;
    public string UseFrequency { get; set; } = string.Empty;
    public long EquipmentSpecificationId { get; set; }
    public long OfficeId { get; set; }
    public string OfficeName {get; set; } = string.Empty;
    public DateTime Created {get;set;}

}