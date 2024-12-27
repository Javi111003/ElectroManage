namespace ElectroManage.Application.DTO_s;

public record EquipmentSpecificationDTO
{
    public long Id {get;set;}
    public string Model{get;set;} = string.Empty;
    public decimal Capacity{get;set;}
    public bool CriticalEnergySystem { get; set; }
    public decimal AverageConsumption { get; set; }
    public int LifeSpanYears { get; set; }
    public decimal Efficiency { get; set; }
    public EquipmentBrandDTO EquipmentBrand{get;set;} = null!;
    public EquipmentTypeDTO EquipmentType {get;set;} = null!;
}
