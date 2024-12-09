namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Post;
public record CreateEquipmentSpecificationCommand : ICommand<CreateEquipmentSpecificationResponse>
{
    public string Model{get;set;} = string.Empty;
    public decimal Capacity{get;set;}
    public bool CriticalEnergySystem { get; set; }
    public decimal AverageConsumption { get; set; }
    public int LifeSpanYears { get; set; }
    public decimal Efficiency { get; set; }
    public long EquipmentBrandId { get; set; }
    public long EquipmentTypeId { get; set; }
}