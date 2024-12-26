using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.Get;

namespace ElectroManage.Application.Mappers;
public static class CompanyMapper
{
    public static CompanyGetByIdResponse ToResponse(Domain.Entites.Sucursal.Company company)
    {
        return new CompanyGetByIdResponse
        {
            Id = company.Id,
            Name = company.Name,
            InstallationType = new InstallationTypeDTO
            {
                Name = company.InstalationType.Name,
                Description = company.InstalationType.Description,
            },
            AdministrativeArea = new AdministrativeAreaDTO
            {
                Name = company.AministrativeArea.Name,
                Description = company.AministrativeArea.Description,
            },
            Location = new LocationDTO
            {
                Name = company.Location.Name,
                Street = company.Location.Street,
                Description = company.Location.Description
            },
            Status = company.StatusBaseEntity.ToString(),
            ManagementTeam = company.ManagementTeam is null ? null : ManagementTeamMapper.MapToManagementTeamDto(company.ManagementTeam)
        };
    }
}