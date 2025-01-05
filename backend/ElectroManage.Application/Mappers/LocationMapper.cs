using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class LocationMapper
{
    public static LocationDTO ToResponse(Domain.Entites.Location location)
    {
        return new LocationDTO
        {
            Id = location.Id,
            AddressDetails = location.AddressDetails,
            CoordenateDTO = new CoordenateDTO
            {
                Latitude = location.Latitude,
                Longitude = location.Longitude
            }
        };
    }
}