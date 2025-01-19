using AutoBogus;
using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mocks;
public class ListMonthlastThreeYearsBogusConfig : AutoFaker<YearCostDTO>
{
    public ListMonthlastThreeYearsBogusConfig()
    {
        RuleFor(x => x.MeanConsumption, f => Math.Round(f.Random.Double(300, 1000),1));
        RuleFor(x => x.MeanCost, f => Math.Round(f.Random.Double(500, 100),2));
    }
}