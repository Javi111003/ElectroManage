using ElectroManage.Application.Features.Office;

namespace ElectroManage.Application.Mappers;

public static class OfficeMapper
{
    public static OfficeResponse ToResponse(Domain.Entites.Offices.Office office)
    {
        return new OfficeResponse
        {
            Id = office.Id,
            Name = office.Name,
            Description = office.Description,
            Company = new CompanyDTO
            {
                Id = office.Company.Id,
                Name = office.Company.Name,
            }
        };
    }
}
