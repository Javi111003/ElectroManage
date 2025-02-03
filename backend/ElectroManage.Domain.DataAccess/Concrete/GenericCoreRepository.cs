using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using System.Linq.Expressions;
using ElectroManage.Domain.Enums;
using ElectroManage.Domain.DataAccess.Extensions;

namespace ElectroManage.Domain.DataAccess.Concrete;
public class GenericCoreRepository<T> : IGenericCoreRepositoryAsync<T> where T : class, IEntity
{
    private readonly ApplicationDbContext _dbContext;
    public bool IsDisposed { get; private set; }

    public GenericCoreRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    /// <summary>
    /// Saves an entity to the database
    /// </summary>
    /// <param name="entity">The entity to save</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    protected virtual void SaveCore(T entity, bool commit = true)
    {
        DbSet<T> dbSet = _dbContext.Set<T>();
        dbSet.Add(entity);
        if (commit)
        {
            Commit();
        }
    }
    /// <summary>
    /// Asynchronously saves an entity to the database
    /// </summary>
    /// <param name="entity">The entity to save</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the asynchronous operation</returns>
    protected virtual async Task SaveCoreAsync(T entity, bool commit = true)
    {
        DbSet<T> dbSet = _dbContext.Set<T>();
        await dbSet.AddAsync(entity);
        if (commit)
        {
            await CommitAsync();
        }
    }
    /// <summary>
    /// Updates an existing entity in the database
    /// </summary>
    /// <param name="entity">The entity to update</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    protected virtual void UpdateCore(T entity, bool commit = true)
    {
        _dbContext.Set<T>().Update(entity);
        if (commit)
        {
            Commit();
        }
    }

    /// <summary>
    /// Asynchronously updates an existing entity in the database
    /// </summary>
    /// <param name="entity">The entity to update</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the asynchronous operation</returns>
    protected virtual async Task UpdateCoreAsync(T entity, bool commit = true)
    {
        _dbContext.Set<T>().Update(entity);
        if (commit)
        {
            await CommitAsync();
        }
    }

    /// <summary>
    /// Deletes an entity from the database
    /// </summary>
    /// <param name="entity">The entity to delete</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <exception cref="Exception">Thrown when deletion fails</exception>
    protected virtual void DeleteCore(T entity, bool commit = true)
    {
        try
        {
            DbSet<T> dbSet = _dbContext.Set<T>();
            dbSet.Remove(entity);
            if (commit)
                Commit();
        }
        catch (Exception)
        {
            if (_dbContext.ChangeTracker.Entries().Any((EntityEntry q) => q.Entity.Equals(entity) && q.State == EntityState.Deleted))
            {
                _dbContext.Entry<T>(entity).State = EntityState.Unchanged;
            }
            throw;
        }
    }

    /// <summary>
    /// Asynchronously deletes an entity from the database
    /// </summary>
    /// <param name="entity">The entity to delete</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the asynchronous operation</returns>
    /// <exception cref="Exception">Thrown when deletion fails</exception>
    protected async virtual Task DeleteCoreAsync(T entity, bool commit = true)
    {
        try
        {
            DbSet<T> dbSet = _dbContext.Set<T>();
            dbSet.Remove(entity);
            if (commit)
                await CommitAsync();
        }
        catch (Exception)
        {
            if (_dbContext.ChangeTracker.Entries().Any((EntityEntry q) => q.Entity.Equals(entity) && q.State == EntityState.Deleted))
            {
                _dbContext.Entry<T>(entity).State = EntityState.Unchanged;
            }
            throw;
        }
    }

    #region ICommitable
    /// <summary>
    /// Saves all changes made in this context to the database
    /// </summary>
    /// <returns>The number of state entries written to the database</returns>
    public virtual int Commit() => _dbContext.SaveChanges();

    /// <summary>
    /// Asynchronously saves all changes made in this context to the database
    /// </summary>
    /// <returns>A task that represents the asynchronous save operation. The task result contains the number of state entries written to the database</returns>
    public virtual async Task<int> CommitAsync() => await _dbContext.SaveChangesAsync();
    #endregion

    #region IGenericCoreRepository
    /// <summary>
    /// Deletes entities that match the specified filters
    /// </summary>
    /// <param name="filters">Expression filters to apply</param>
    public void Delete(params Expression<Func<T, bool>>[] filters)
    {
        DbSet<T> source = _dbContext.Set<T>();
        IQueryable<T> queryable;
        if (CollectionUtils.IsNullOrEmpty(filters))
        {
            queryable = source.AsQueryable<T>();
        }
        else
        {
            queryable = filters.Aggregate(source.OfType<T>(), (IQueryable<T> current, Expression<Func<T, bool>> expression) => current.Where(expression));
        }
        foreach (T current2 in queryable)
        {
            this.DeleteCore(current2);
        }
    }

    /// <summary>
    /// Gets an entity by its ID
    /// </summary>
    /// <typeparam name="TKey">The type of the ID</typeparam>
    /// <param name="id">The ID of the entity to retrieve</param>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <returns>The entity with the specified ID</returns>
    public T GetById<TKey>(TKey id, bool useInactive = false) => _dbContext!.Set<T>()!.Find(id)!;

    /// <summary>
    /// Retrieves the first entity that matches the specified criteria
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <param name="includes">Navigation properties to include</param>
    /// <param name="filters">Expression filters to apply</param>
    /// <returns>The first matching entity</returns>
    public T First(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters) => QueryCore(useInactive, includes, filters).FirstOrDefault()!;

    /// <summary>
    /// Retrieves all entities that match the specified criteria
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <param name="includes">Navigation properties to include in the query</param>
    /// <param name="filters">Expression filters to apply to the query</param>
    /// <returns>An IQueryable of all matching entities</returns>
    public IQueryable<T> GetAll(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters) 
        => QueryCore(useInactive, includes, filters);

    /// <summary>
    /// Retrieves all entities that match the specified criteria without tracking changes
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <param name="includes">Navigation properties to include in the query</param>
    /// <param name="filters">Expression filters to apply to the query</param>
    /// <returns>An IQueryable of all matching entities with change tracking disabled</returns>
    public IQueryable<T> GetAllListOnly(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters) 
        => QueryCore(useInactive, includes, filters).AsNoTracking();

    /// <summary>
    /// Counts the number of entities that match the specified criteria
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the count</param>
    /// <param name="includes">Navigation properties to include in the query</param>
    /// <param name="filters">Expression filters to apply to the query</param>
    /// <returns>The number of matching entities</returns>
    public long Count(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[] filters) 
        => QueryCore(useInactive, includes, filters).Count<T>();
    #endregion

    #region IGenericCoreRepositoryAsync
    /// <summary>
    /// Asynchronously saves an entity to the database
    /// </summary>
    /// <param name="entity">The entity to save</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the save operation</returns>
    public async Task SaveAsync(T entity, bool commit = true) => await SaveCoreAsync(entity, commit);

    /// <summary>
    /// Asynchronously saves multiple entities to the database
    /// </summary>
    /// <param name="entities">The collection of entities to save</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the save operation</returns>
    public async Task SaveRangeAsync(IEnumerable<T> entities, bool commit = true)
    {
        foreach (var entity in entities)
        {
            await SaveCoreAsync(entity, commit);
        }
    }

    /// <summary>
    /// Asynchronously updates an entity in the database
    /// </summary>
    /// <param name="entity">The entity to update</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the update operation</returns>
    public async Task UpdateAsync(T entity, bool commit = true) => await UpdateCoreAsync(entity, commit);

    /// <summary>
    /// Asynchronously deletes an entity from the database
    /// </summary>
    /// <param name="entity">The entity to delete</param>
    /// <param name="commit">If true, changes will be committed immediately</param>
    /// <returns>A task representing the delete operation</returns>
    public async Task DeleteAsync(T entity, bool commit = true) => await DeleteCoreAsync(entity, commit);

    /// <summary>
    /// Asynchronously retrieves an entity by its ID
    /// </summary>
    /// <typeparam name="TKey">The type of the ID</typeparam>
    /// <param name="id">The ID of the entity to retrieve</param>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <returns>A task containing the found entity or null if not found</returns>
    public async Task<T> GetByIdAsync<TKey>(TKey id, bool useInactive = false) => await _dbContext.Set<T>().FindAsync(id);

    /// <summary>
    /// Asynchronously retrieves the first entity that matches the specified criteria
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <param name="includes">Navigation properties to include in the query</param>
    /// <param name="filters">Expression filters to apply to the query</param>
    /// <returns>A task containing the first matching entity or null if none found</returns>
    public async Task<T> FirstAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters)
        => await QueryCore(useInactive, includes, filters).FirstOrDefaultAsync();

    /// <summary>
    /// Asynchronously counts the number of entities that match the specified criteria
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the count</param>
    /// <param name="includes">Navigation properties to include in the query</param>
    /// <param name="filters">Expression filters to apply to the query</param>
    /// <returns>A task containing the count of matching entities</returns>
    public async Task<long> CountAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters)
         => await QueryCore(useInactive, includes, filters).CountAsync();

    #endregion

    #region IDisposable
    /// <summary>
    /// Finalizer that ensures resources are cleaned up
    /// </summary>
    ~GenericCoreRepository()
    {
        Dispose(false);
    }

    /// <summary>
    /// Disposes of the repository and its resources
    /// </summary>
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Protected implementation of the dispose pattern
    /// </summary>
    /// <param name="disposing">True if called from Dispose(), false if called from finalizer</param>
    protected virtual void Dispose(bool disposing)
    {
        if (!this.IsDisposed && disposing && _dbContext != null)
        {
            _dbContext.Dispose();
        }
        this.IsDisposed = true;
    }
    #endregion


    /// <summary>
    /// Builds and executes a query based on the specified parameters
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <param name="includes">Navigation properties to include</param>
    /// <param name="filters">Expression filters to apply</param>
    /// <returns>An IQueryable of entities matching the criteria</returns>
    /// <exception cref="Exception">Thrown when the query execution fails</exception>
    private IQueryable<T> QueryCore(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters)
    {
        try
        {
            Func<IQueryable<T>, Expression<Func<T, bool>>, IQueryable<T>>? func = ((current, expression) => current.Where(expression));
            DbSet<T> source = _dbContext.Set<T>();


            IQueryable<T> queryable = source.OfType<T>();

            if (includes != null)
            {
                Expression<Func<T, object>>[]? array = (includes as Expression<Func<T, object>>[]) ?? includes.ToArray();
                if (!CollectionUtils.IsNullOrEmpty(array))
                {
                    queryable = PerformInclusions(array, queryable);
                }
            }

            if (!CollectionUtils.IsNullOrEmpty(filters))
            {
                queryable = filters!.Aggregate(queryable, func);
            }

            Expression<Func<T, bool>> statusFilter = (T f) => f.StatusBaseEntity == StatusEntityType.Active
                || (useInactive && f.StatusBaseEntity == StatusEntityType.Inactive)
                || (useInactive && f.StatusBaseEntity == StatusEntityType.InEdition);

            queryable = queryable.Where(statusFilter);

            return queryable;
        }
        catch (Exception dbEx)
        {
            throw dbEx;
        }
    }

    /// <summary>
    /// Applies the specified includes to a query
    /// </summary>
    /// <param name="includes">Navigation properties to include</param>
    /// <param name="query">The base query to extend</param>
    /// <returns>The query with includes applied</returns>
    private static IQueryable<T> PerformInclusions(IEnumerable<Expression<Func<T, object>>>? includes, IQueryable<T> query) =>
        includes!.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

    /// <summary>
    /// Gets a filtered and sorted queryable based on the query request
    /// </summary>
    /// <param name="useInactive">If true, includes inactive entities in the query</param>
    /// <param name="includes">Navigation properties to include</param>
    /// <param name="req">Query request containing filters and sorts</param>
    /// <returns>A filtered and sorted IQueryable of entities</returns>
    public IQueryable<T> GetAllFiltered(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, QueryRequest? req = null)
           => QueryCore(useInactive: useInactive, includes: includes).ToDynamic(filters: req?.Filters, sorts: req?.Sorts);

}