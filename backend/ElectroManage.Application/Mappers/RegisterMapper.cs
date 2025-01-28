using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class RegisterMapper
{
    public static RegisterDTO MapToRegisterDto(Domain.Entites.Sucursal.Register register)
    {
        return new RegisterDTO {
            Id = register.Id,
            Date = register.Date,
            Cost = register.Cost,
            Consumption = register.Consumption,
        };
    }

    public static ListRegisterByCompanyResponse MapToListRegisterResponse(IEnumerable<RegisterDTO> registers)
    {
        return new ListRegisterByCompanyResponse
        {
            TotalCost = registers.Sum(r => r.Cost),
            TotalConsumption = registers.Sum(r => r.Consumption),
            Registers = registers
        };
    }
}