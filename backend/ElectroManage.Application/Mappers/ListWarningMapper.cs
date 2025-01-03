using ElectroManage.Application.DTO_s;
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
}
