using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Abstractions;

/// <summary>
/// Interface for the Proyection Service.
/// </summary>
public interface IProyectionService
{
    /// <summary>
    /// Calculates the projections for a given company.
    /// </summary>
    /// <param name="company">The company for which to calculate projections.</param>
    /// <returns>A collection of ProyectionDTO objects representing the projections.</returns>
    public IEnumerable<ProyectionDTO> CalculateProyectionsAsync(Domain.Entites.Sucursal.Company company);
}
