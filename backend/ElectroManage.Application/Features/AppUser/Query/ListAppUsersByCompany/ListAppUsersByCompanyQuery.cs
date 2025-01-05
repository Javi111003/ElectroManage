using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsersByCompany;
public record ListAppUsersByCompanyQuery : ICommand<IEnumerable<AppUserDto>>
{
    public long CompanyId { get; set; }
}