using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Location.Command.Put;

namespace ElectroManage.Application.Mappers;

public static class LocationMapper
{
    public static EditGeneralDataLocationResponse ToResponse(Domain.Entites.Location location)
    {
        return new EditGeneralDataLocationResponse
        {
            Id = location.Id,
            Name = location.Name,
            Description = location.Description,
            ZipCode = location.ZipCode,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            Address = new AddressDTO
            {
                Number = location.Number,
                Street = location.Street,
                Neighborhood = location.Neighborhood,
                BeetweenStreets = location.BetweenStreets,
                Town = location.Town,
                Country = location.Country,
                Province = location.Province,
            }
        };
    }
}
