namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Post;
public record CreateEquipmentSpecificationResponse
{
    public long Id {get;set;}
    public string Model{get;set;} = string.Empty;
    public decimal Capacity{get;set;}
    public bool CriticalEnergySystem { get; set; }
    public decimal AverageConsumption { get; set; }
    public int LifeSpanYears { get; set; }
    public decimal Efficiency { get; set; }
    public string EquipmentBrand{get;set;} = string.Empty;
    public long EquipmentBrandId { get; set; }
    public string EquipmentType {get;set;} = string.Empty;
    public long EquipmentTypeId { get; set; }
    public DateTime Created {get;set;}
}