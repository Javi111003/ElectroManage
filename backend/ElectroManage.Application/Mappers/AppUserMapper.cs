using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.AppUser.Query.GetById;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Mappers;
public static class AppUserMapper
{
    public static GetUserByIdResponse MapToGetByIdResponse(User user , IList<string>? roles)
    {
        var response = new GetUserByIdResponse()
        {
            Email = user.Email!,
            Company = new CompanyDTO
            {
                Id = user.Company.Id,
                Name = user.Company.Name
            },
            Roles = roles ?? []
        };
        return response;
    }
}