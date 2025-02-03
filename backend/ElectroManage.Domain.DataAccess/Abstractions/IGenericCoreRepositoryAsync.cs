using System.Linq.Expressions;

namespace ElectroManage.Domain.DataAccess.Abstractions
{
    /// <summary>
    /// Defines a generic asynchronous repository interface for basic CRUD operations
    /// </summary>
    /// <typeparam name="T">The type of entity the repository will manage</typeparam>
    public interface IGenericCoreRepositoryAsync<T> : IGenericCoreRepository<T> where T : class
    {
        /// <summary>
        /// Asynchronously saves an entity to the repository
        /// </summary>
        /// <param name="entity">The entity to save</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        /// <returns>A task representing the asynchronous save operation</returns>
        Task SaveAsync(T entity, bool commit = true);

        /// <summary>
        /// Asynchronously saves a range of entities to the repository
        /// </summary>
        /// <param name="entities">The collection of entities to save</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        /// <returns>A task representing the asynchronous save operation</returns>
        Task SaveRangeAsync(IEnumerable<T> entities, bool commit = true);

        /// <summary>
        /// Asynchronously updates an existing entity in the repository
        /// </summary>
        /// <param name="entity">The entity to update</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        /// <returns>A task representing the asynchronous update operation</returns>
        Task UpdateAsync(T entity, bool commit = true);

        /// <summary>
        /// Asynchronously deletes an entity from the repository
        /// </summary>
        /// <param name="entity">The entity to delete</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        /// <returns>A task representing the asynchronous delete operation</returns>
        Task DeleteAsync(T entity, bool commit = true);

        /// <summary>
        /// Asynchronously retrieves an entity by its ID
        /// </summary>
        /// <typeparam name="TKey">The type of the ID</typeparam>
        /// <param name="id">The ID of the entity to retrieve</param>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <returns>A task containing the found entity or null if not found</returns>
        Task<T> GetByIdAsync<TKey>(TKey id, bool useInactive = false);

        /// <summary>
        /// Asynchronously retrieves the first entity that matches the specified criteria
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="filters">Expression filters to apply</param>
        /// <returns>A task containing the first matching entity or null if none found</returns>
        Task<T> FirstAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

        /// <summary>
        /// Asynchronously counts the number of entities that match the specified criteria
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the count</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="filters">Expression filters to apply</param>
        /// <returns>A task containing the count of matching entities</returns>
        Task<long> CountAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
    }
}