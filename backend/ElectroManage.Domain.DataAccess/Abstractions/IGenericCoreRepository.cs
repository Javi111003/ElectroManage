using ElectroManage.Common.Dtos;
using System.Linq.Expressions;

namespace ElectroManage.Domain.DataAccess.Abstractions
{
    /// <summary>
    /// Defines a generic repository interface for basic CRUD operations
    /// </summary>
    /// <typeparam name="T">The type of entity the repository will manage</typeparam>
    public interface IGenericCoreRepository<T> : ICommitable where T : class
    {
        /// <summary>
        /// Deletes a single entity from the repository
        /// </summary>
        /// <param name="entity">The entity to delete</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        void Delete(T entity, bool commit = true);

        /// <summary>
        /// Deletes a range of entities from the repository
        /// </summary>
        /// <param name="entities">The collection of entities to delete</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        void DeleteRange(IEnumerable<T> entities, bool commit = true);

        /// <summary>
        /// Deletes entities that match the specified filters
        /// </summary>
        /// <param name="filters">Expression filters to apply</param>
        void Delete(params Expression<Func<T, bool>>[] filters);

        /// <summary>
        /// Saves a single entity to the repository
        /// </summary>
        /// <param name="entity">The entity to save</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        void Save(T entity, bool commit = true);

        /// <summary>
        /// Updates an existing entity in the repository
        /// </summary>
        /// <param name="entity">The entity to update</param>
        /// <param name="commit">If true, changes will be committed immediately</param>
        void Update(T entity, bool commit = true);

        /// <summary>
        /// Retrieves an entity by its ID
        /// </summary>
        /// <typeparam name="TKey">The type of the ID</typeparam>
        /// <param name="id">The ID of the entity to retrieve</param>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <returns>The entity with the specified ID</returns>
        T GetById<TKey>(TKey id, bool useInactive = false);

        /// <summary>
        /// Retrieves the first entity that matches the specified criteria
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="filters">Expression filters to apply</param>
        /// <returns>The first matching entity</returns>
        T First(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

        /// <summary>
        /// Retrieves all entities that match the specified criteria
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="filters">Expression filters to apply</param>
        /// <returns>An IQueryable of all matching entities</returns>
        IQueryable<T> GetAll(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

        /// <summary>
        /// Retrieves all entities that match the specified criteria without tracking changes
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="filters">Expression filters to apply</param>
        /// <returns>An IQueryable of all matching entities with change tracking disabled</returns>
        IQueryable<T> GetAllListOnly(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);

        /// <summary>
        /// Retrieves a filtered and sorted queryable based on the query request
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the query</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="req">Query request containing filters and sorts</param>
        /// <returns>A filtered and sorted IQueryable of entities</returns>
        IQueryable<T> GetAllFiltered(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, QueryRequest? req = null);

        /// <summary>
        /// Counts the number of entities that match the specified criteria
        /// </summary>
        /// <param name="useInactive">If true, includes inactive entities in the count</param>
        /// <param name="includes">Navigation properties to include</param>
        /// <param name="filters">Expression filters to apply</param>
        /// <returns>The number of matching entities</returns>
        long Count(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[] filters);
    }
}