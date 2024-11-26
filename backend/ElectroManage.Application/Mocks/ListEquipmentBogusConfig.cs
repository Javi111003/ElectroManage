﻿using AutoBogus;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.Enums.Equipment;

namespace ElectroManage.Application.Mocks;
public class ListEquipmentBogusConfig : AutoFaker<ListEquipmentResponse>
{
    public ListEquipmentBogusConfig()
    {
        RuleFor(x => x.Id, x => x.Random.Long(1, 1000));
        RuleFor(x => x.Name, x => x.Random.Words(1));
        RuleFor(x => x.UseFrequency, x => x.PickRandom<UseFrequency>().ToString());
        RuleFor(x => x.Model, x=> x.Random.Words(1));
        RuleFor(x => x.Efficency, x => x.Random.Decimal(1, 100));
        RuleFor(x => x.Brand, x => x.Random.Words(1));
        RuleFor(x => x.EquipmentType, x => x.Random.Words(1));
    }
}
