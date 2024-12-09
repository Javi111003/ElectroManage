namespace ElectroManage.Application.Features.EquipmentSpecification.Query.Get;

public record EquipmentSpecificationGetByIdCommand : ICommand<EquipmentSpecificationGetByIdResponse>
{
    public long Id { get; set; }
}