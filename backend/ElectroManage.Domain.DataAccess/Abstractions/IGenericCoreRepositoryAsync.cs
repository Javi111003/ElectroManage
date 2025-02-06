using System.Linq.Expressions;

namespace ElectroManage.Domain.DataAccess.Abstractions;
/// <summary>
/// Interface for generic asynchronous repository operations.
/// </summary>
/// <typeparam name="T">The type of the entity.</typeparam>
public interface IGenericCoreRepositoryAsync<T> : IGenericCoreRepository<T> where T : class
{
    /// <summary>
    /// Saves the specified entity asynchronously.
    /// </summary>
    /// <param name="entity">The entity to save.</param>
    /// <param name="commit">If set to <c>true</c>, commits the changes.</param>
    /// <returns>A task that represents the asynchronous save operation.</returns>
    Task SaveAsync(T entity, bool commit = true);

    /// <summary>
    /// Saves the specified range of entities asynchronously.
    /// </summary>
    /// <param name="entities">The entities to save.</param>
    /// <param name="commit">If set to <c>true</c>, commits the changes.</param>
    /// <returns>A task that represents the asynchronous save range operation.</returns>
    Task SaveRangeAsync(IEnumerable<T> entities, bool commit = true);

    /// <summary>
    /// Updates the specified entity asynchronously.
    /// </summary>
    /// <param name="entity">The entity to update.</param>
    /// <param name="commit">If set to <c>true</c>, commits the changes.</param>
    /// <returns>A task that represents the asynchronous update operation.</returns>
    Task UpdateAsync(T entity, bool commit = true);

    /// <summary>
    /// Deletes the specified entity asynchronously.
    /// </summary>
    /// <param name="entity">The entity to delete.</param>
    /// <param name="commit">If set to <c>true</c>, commits the changes.</param>
    /// <returns>A task that represents the asynchronous delete operation.</returns>
    Task DeleteAsync(T entity, bool commit = true);

    /// <summary>
    /// Gets the entity by identifier asynchronously.
    /// </summary>
    /// <typeparam name="TKey">The type of the key.</typeparam>
    /// <param name="id">The identifier.</param>
    /// <param name="useInactive">If set to <c>true</c>, includes inactive entities.</param>
    /// <returns>A task that represents the asynchronous get operation. The task result contains the entity.</returns>
    Task<T> GetByIdAsync<TKey>(TKey id, bool useInactive = false);

    /// <summary>
    /// Gets the first entity that matches the specified filters asynchronously.
    /// </summary>
    /// <param name="useInactive">If set to <c>true</c>, includes inactive entities.</param>
    /// <param name="includes">The related entities to include.</param>
    /// <param name="filters">The filters to apply.</param>
    /// <returns>A task that represents the asynchronous get operation. The task result contains the first entity that matches the filters.</returns>
    Task<T> FirstAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

    /// <summary>
    /// Counts the entities that match the specified filters asynchronously.
    /// </summary>
    /// <param name="useInactive">If set to <c>true</c>, includes inactive entities.</param>
    /// <param name="includes">The related entities to include.</param>
    /// <param name="filters">The filters to apply.</param>
    /// <returns>A task that represents the asynchronous count operation. The task result contains the number of entities that match the filters.</returns>
    Task<long> CountAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
}