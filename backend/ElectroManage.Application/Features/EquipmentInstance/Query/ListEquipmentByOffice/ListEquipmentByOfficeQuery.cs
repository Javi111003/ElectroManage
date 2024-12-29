using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentInstance.Query.ListEquipmentByOffice;
public record ListEquipmentByOfficeQuery : ICommand<IEnumerable<EquipmentInstanceDTO>>
{
    public long OfficeId { get; set; }
}