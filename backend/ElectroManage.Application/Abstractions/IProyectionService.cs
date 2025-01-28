using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Abstractions;

public interface IProyectionService
{
    public Task<IEnumerable<ProyectionDTO>> CalculateProyectionsAsync(Domain.Entites.Sucursal.Company company);
}
