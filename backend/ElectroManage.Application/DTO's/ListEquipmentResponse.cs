using ElectroManage.Domain.Enums.Equipment;

namespace ElectroManage.Application.DTO_s;

public record ListEquipmentResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UseFrequency { get; set; } = string.Empty;
}
