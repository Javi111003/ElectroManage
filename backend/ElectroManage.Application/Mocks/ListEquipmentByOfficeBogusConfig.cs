using AutoBogus;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.Enums.Equipment;

namespace ElectroManage.Application.Mocks;
public class ListEquipmentByOfficeBogusConfig : AutoFaker<ListEquipmentByOfficeResponse>
{
    public ListEquipmentByOfficeBogusConfig()
    {
        RuleFor(x => x.CompanyId, x => x.IndexFaker = 23);
        RuleFor(x => x.Id, x => x.Random.Long(1, 1000));
        RuleFor(x => x.OfficeId, x => x.IndexFaker = 34);
        RuleFor(x => x.Name, x => x.Random.Words(1));
        RuleFor(x => x.UseFrequency, x => x.PickRandom<UseFrequency>().ToString());
        RuleFor(x => x.MaintenanceStatus, x => x.PickRandom<MaintenanceStatus>().ToString());
        RuleFor(x => x.Model, x => x.Random.Words(1));
        RuleFor(x => x.Efficency, x => Math.Round(x.Random.Decimal(1, 100),1));
        RuleFor(x => x.Brand, x => x.Random.Words(1));
        RuleFor(x => x.EquipmentType, x => x.Random.Words(1));
    }
}