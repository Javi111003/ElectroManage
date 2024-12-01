using AutoBogus;
using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mocks;
public class ListMonthlastThreeYearsBogusConfig : AutoFaker<YearCostDTO>
{
    public ListMonthlastThreeYearsBogusConfig()
    {
        RuleFor(x => x.MeanMonthlyConsumption, f => Math.Round(f.Random.Decimal(300, 1000),1));
        RuleFor(x => x.MeanMonthlyCost, f => Math.Round(f.Random.Decimal(500, 100),2));
    }
}