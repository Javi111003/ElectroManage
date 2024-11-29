using AutoBogus;
using Bogus;
using ElectroManage.Application.DTO_s;
namespace ElectroManage.Application.Mocks;
public class ListPolicyByCompanyBogusConfig : AutoFaker<ListPolicyResponse>
{
    public ListPolicyByCompanyBogusConfig(int companyId)
    {
        Randomizer.Seed = new Random(123456);
        RuleFor(x => x.Id, x => x.Random.Long(1, 1000));
        RuleFor(x => x.Name, x => x.Random.Words(5));
        RuleFor(x => x.ApplyingDate, x => x.Date.Past(2,DateTime.Now));
        RuleFor(x => x.CompanyId, x => x.IndexFaker = companyId);
    }
}