using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Abstractions;

public interface IProyectionService
{
    public IEnumerable<ProyectionDTO> CalculateProyectionsAsync(Domain.Entites.Sucursal.Company company);
}
