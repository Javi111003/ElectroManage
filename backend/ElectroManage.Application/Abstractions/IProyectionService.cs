using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Abstractions;

/// <summary>
/// Provides an abstraction for services that calculate projections for a company.
/// </summary>
public interface IProyectionService
{
    /// <summary>
    /// Calculates projections for a given company.
    /// </summary>
    /// <param name="company">The company entity for which projections are calculated.</param>
    /// <returns>An enumerable collection of projection data transfer objects.</returns>
    public IEnumerable<ProyectionDTO> CalculateProyectionsAsync(Domain.Entites.Sucursal.Company company);
}