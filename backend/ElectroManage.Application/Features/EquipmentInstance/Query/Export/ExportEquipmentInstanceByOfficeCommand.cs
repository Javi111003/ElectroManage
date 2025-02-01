using System;
namespace ElectroManage.Application.Features.EquipmentInstance.Query.Export.List;
public class ExportEquipmentInstancesByOfficeCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public long OfficeId { get; set; }
    public string Format { get; set; } = "pdf";
}