using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.Get;

namespace ElectroManage.Application.Mappers;
public static class CompanyMapper
{
    public static CompanyDTO MapToCompanyDTO(Domain.Entites.Sucursal.Company company)
    {
        return new CompanyDTO
        {
            Id = company.Id,
            Name = company.Name
        };
    }
    public static CompanyResponse ToResponse(Domain.Entites.Sucursal.Company company)
    {
        return new CompanyResponse
        {
            Id = company.Id,
            Name = company.Name,
            ConsumptionLimit = company.ConsumptionLimit,
            InstallationType = new InstallationTypeDTO
            {
                Id = company.InstalationType.Id,
                Name = company.InstalationType.Name,
                Description = company.InstalationType.Description,
            },
            AdministrativeArea = new AdministrativeAreaDTO
            {
                Id = company.AministrativeArea.Id,
                Name = company.AministrativeArea.Name,
                Description = company.AministrativeArea.Description,
            },
            Location = new LocationDTO
            {
                Id = company.Location.Id,
                AddressDetails = company.Location.AddressDetails,
                CoordenateDTO = new CoordenateDTO
                {
                    Longitude = company.Location.Longitude,
                    Latitude = company.Location.Latitude
                }
            },
            CurrentEfficiencyPolicy = company.EfficiencyPoliciesApplyed.Count == 0 ? null : EfficiencyPolicyMapper.MapToAppliedEfficiencyPolicyDTO(company.EfficiencyPoliciesApplyed.Last()),
            Status = company.StatusBaseEntity.ToString(),
            ManagementTeam = company.ManagementTeam is null ? null : ManagementTeamMapper.MapToManagementTeamDto(company.ManagementTeam)
        };
    }
}