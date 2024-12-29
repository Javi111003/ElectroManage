namespace ElectroManage.Application.Features.EquipmentBrand.Query.Get;

public record EquipmentBrandGetByIdCommand : ICommand<EquipmentBrandGetByIdResponse>
{
    public long Id { get; set; }
}
