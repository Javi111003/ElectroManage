namespace ElectroManage.Application.Features.EquipmentType.Query.Get;

public record EquipmentTypeGetByIdCommand : ICommand<EquipmentTypeGetByIdResponse>
{
    public long Id { get; set; }
}
