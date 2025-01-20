using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListRegistersByCompany;

public record ListRegistersByCompanyCommand : ICommand<IEnumerable<RegisterDTO>>
{
    public long Id { get; set; }
}
