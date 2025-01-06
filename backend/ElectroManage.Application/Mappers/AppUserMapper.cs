using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.AppUser.Query.GetById;
using ElectroManage.Application.Features.AppUser.Query.ListAppUsers;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Mappers;
public static class AppUserMapper
{
    public static GetUserByIdResponse MapToGetByIdResponse(User user , IList<string>? roles)
    {
        var response = new GetUserByIdResponse()
        {
            Email = user.Email!,
            Username = user.UserName!,
            Company = new CompanyDTO
            {
                Id = user.Company.Id,
                Name = user.Company.Name
            },
            Roles = roles ?? []
        };
        return response;
    }
    public static IEnumerable<AppUserDto> MapToListUsersResponse(IEnumerable<Domain.Entites.Identity.AppUser> users)
    {
        var response = users.Select(u => new AppUserDto
        {
            Id = u.Id,
            Company = new CompanyDTO
            {
                Id = u.Company.Id,
                Name = u.Company.Name
            },
            Email = u.Email!,
            Username = u.UserName!,
        });
        return response;
    }
}