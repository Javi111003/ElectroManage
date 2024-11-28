using AutoBogus;
using ElectroManage.Application.DTO_s;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Mocks;

public class ListWarningsByCompanyBogusConfig : AutoFaker<WarningDTO>
{
    public ListWarningsByCompanyBogusConfig()
    {
        RuleFor(x => x.Month, x => x.Random.Int(1, 12));
        RuleFor(x => x.Year, x => x.Random.Int(2000, 2024));
        RuleFor(x => x.Consumption, x => x.Random.Decimal(500, 1000));
        RuleFor(x => x.EstablishedLimit, x => x.Random.Decimal(250, 600));
    }
}
