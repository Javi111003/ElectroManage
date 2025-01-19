using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListCompanyOverLimit;
namespace ElectroManage.Application.Mappers;

public static class ListWarningMapper
{
    public static ListWarningsByCompanyResponse ToResponse(Domain.Entites.Sucursal.Company company)
    {
        return new ListWarningsByCompanyResponse
        {
            CompanyID = company.Id,
            CompanyName = company.Name,
            Warnings = company.Warnings.Select(w => new WarningDTO
            {
                Consumption = w.Consumption,
                EstablishedLimit = w.EstablishedLimit,
                Month = w.Created.Month,
                Year = w.Created.Year,
            }).ToList(),
        };
    }
    public static CompanyOverLimitResponse ToCompanyOverLimitResponse(Domain.Entites.Sucursal.Warning warning)
    {
        return new CompanyOverLimitResponse
        {
            Company = new CompanyDTO
            {
                Id = warning.Company.Id,
                Name = warning.Company.Name,
            },
            Limit = warning.EstablishedLimit,
            Consumption = warning.Consumption,
            Exceeded = warning.Consumption - warning.EstablishedLimit,

        };
    }
}
