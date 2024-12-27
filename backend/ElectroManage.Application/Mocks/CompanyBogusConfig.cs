using AutoBogus;
using Bogus;
using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mocks;
public class CompanyBogusConfig : AutoFaker<CompanyDTO>
{
    public CompanyBogusConfig()
    {
        Randomizer.Seed = new Random(123456);
        RuleFor(x => x.Id, x => x.Random.Long(1, 1000));
        RuleFor(x => x.Name, x => x.Company.CompanyName());
    }
}