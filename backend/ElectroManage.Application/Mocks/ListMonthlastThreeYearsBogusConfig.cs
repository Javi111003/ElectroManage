using AutoBogus;
using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mocks;

public class ListMonthlastThreeYearsBogusConfig : AutoFaker<MonthlyCostDTO>
{
    public ListMonthlastThreeYearsBogusConfig()
    {
        RuleFor(x => x.Cost, x => x.Random.Long(40, 1000));
        RuleFor(x => x.Consumption, x => x.Random.Long(100,500));
    }
}
