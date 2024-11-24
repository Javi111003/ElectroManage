using AutoBogus;
using Bogus;
using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mocks;
public class ListRegisterBogusConfig : AutoFaker<DailyCostByCompanyDto>
{
    public ListRegisterBogusConfig()
    {
        Randomizer.Seed = new Random(123456);
        RuleFor(x => x.RegisterId, x => x.Random.Long(1, 1000));
        RuleFor(x => x.CompanyId, x => x.Random.Long(1, 1000));
        RuleFor(x => x.RegisterDate, x => x.Date.Past(2,DateTime.Now));
        RuleFor(x => x.Consumption, x => Math.Round(x.Random.Decimal(1, 1000),1));
        RuleFor(x => x.Cost, x => Math.Round(x.Random.Decimal(500, 5000),2));
    }
}