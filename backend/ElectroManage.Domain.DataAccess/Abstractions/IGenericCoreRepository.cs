using ElectroManage.Common.Dtos;
using System.Linq.Expressions;

namespace ElectroManage.Domain.DataAccess.Abstractions;

/// <summary>
/// Generic interface for the main repository defining CRUD methods and queries.
/// </summary>
/// <typeparam name="T">The type of entity.</typeparam>
public interface IGenericCoreRepository<T> : ICommitable where T : class
{
    /// <summary>
    /// Deletes an entity.
    /// </summary>
    /// <param name="entity">The entity to delete.</param>
    /// <param name="commit">Whether to commit the transaction.</param>
    void Delete(T entity, bool commit = true);

    /// <summary>
    /// Deletes a range of entities.
    /// </summary>
    /// <param name="entities">The entities to delete.</param>
    /// <param name="commit">Whether to commit the transaction.</param>
    void DeleteRange(IEnumerable<T> entities, bool commit = true);

    /// <summary>
    /// Deletes entities that match the specified filters.
    /// </summary>
    /// <param name="filters">Filters to select the entities to delete.</param>
    void Delete(params Expression<Func<T, bool>>[] filters);

    /// <summary>
    /// Saves an entity.
    /// </summary>
    /// <param name="entity">The entity to save.</param>
    /// <param name="commit">Whether to commit the transaction.</param>
    void Save(T entity, bool commit = true);

    /// <summary>
    /// Updates an entity.
    /// </summary>
    /// <param name="entity">The entity to update.</param>
    /// <param name="commit">Whether to commit the transaction.</param>
    void Update(T entity, bool commit = true);

    /// <summary>
    /// Gets an entity by its identifier.
    /// </summary>
    /// <typeparam name="TKey">The type of the identifier.</typeparam>
    /// <param name="id">The identifier of the entity.</param>
    /// <param name="useInactive">Whether to include inactive entities.</param>
    /// <returns>The found entity.</returns>
    T GetById<TKey>(TKey id, bool useInactive = false);

    /// <summary>
    /// Gets the first entity that matches the specified filters.
    /// </summary>
    /// <param name="useInactive">Whether to include inactive entities.</param>
    /// <param name="includes">Navigation properties to include.</param>
    /// <param name="filters">Filters to select the entity.</param>
    /// <returns>The first found entity.</returns>
    T First(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

    /// <summary>
    /// Gets all entities.
    /// </summary>
    /// <param name="useInactive">Whether to include inactive entities.</param>
    /// <param name="includes">Navigation properties to include.</param>
    /// <param name="filters">Filters to select the entities.</param>
    /// <returns>A query of the entities.</returns>
    IQueryable<T> GetAll(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

    /// <summary>
    /// Gets all entities for listing only.
    /// </summary>
    /// <param name="useInactive">Whether to include inactive entities.</param>
    /// <param name="includes">Navigation properties to include.</param>
    /// <param name="filters">Filters to select the entities.</param>
    /// <returns>A query of the entities.</returns>
    IQueryable<T> GetAllListOnly(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

    /// <summary>
    /// Gets all filtered entities.
    /// </summary>
    /// <param name="useInactive">Whether to include inactive entities.</param>
    /// <param name="includes">Navigation properties to include.</param>
    /// <param name="req">Query requirements.</param>
    /// <returns>A query of the filtered entities.</returns>
    IQueryable<T> GetAllFiltered(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, QueryRequest? req = null);

    /// <summary>
    /// Counts the number of entities.
    /// </summary>
    /// <param name="useInactive">Whether to include inactive entities.</param>
    /// <param name="includes">Navigation properties to include.</param>
    /// <param name="filters">Filters to select the entities.</param>
    /// <returns>The number of entities.</returns>
    long Count(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[] filters);
}