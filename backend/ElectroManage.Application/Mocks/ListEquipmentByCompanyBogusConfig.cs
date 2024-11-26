using AutoBogus;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.Enums.Equipment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Mocks;

public class ListEquipmentByCompanyBogusConfig : AutoFaker<ListEquipmentByCompanyResponse>
{
    public ListEquipmentByCompanyBogusConfig()
    {
        RuleFor(x => x.CompanyId, x => x.IndexFaker = 1);
        RuleFor(x => x.Id, x => x.Random.Long(1, 1000));
        RuleFor(x => x.Name, x => x.Random.Words(1));
        RuleFor(x => x.UseFrequency, x => x.PickRandom<UseFrequency>().ToString());
        RuleFor(x => x.Model, x => x.Random.Words(1));
        RuleFor(x => x.Efficency, x => x.Random.Decimal(1, 100));
        RuleFor(x => x.Brand, x => x.Random.Words(1));
        RuleFor(x => x.EquipmentType, x => x.Random.Words(1));
    }
}
