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
    protected virtual void SaveCore(T entity, bool commit = true)
    {
        DbSet<T> dbSet = _dbContext.Set<T>();
        dbSet.Add(entity);
        if (commit)
        {
            Commit();
        }
    }
    protected virtual async Task SaveCoreAsync(T entity, bool commit = true)
    {
        DbSet<T> dbSet = _dbContext.Set<T>();
        await dbSet.AddAsync(entity);
        if (commit)
        {
            await CommitAsync();
        }
    }
    protected virtual void UpdateCore(T entity, bool commit = true)
    {
        _dbContext.Set<T>().Update(entity);
        if (commit)
        {
            Commit();
        }
    }

    protected virtual async Task UpdateCoreAsync(T entity, bool commit = true)
    {
        _dbContext.Set<T>().Update(entity);
        if (commit)
        {
            await CommitAsync();
        }
    }

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
    public virtual int Commit() => _dbContext.SaveChanges();
    public virtual async Task<int> CommitAsync() => await _dbContext.SaveChangesAsync();
    #endregion

    #region IGenericCoreRepository
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

    public void Delete(T entity, bool commit = true) => DeleteCore(entity, commit);
    public void DeleteRange(IEnumerable<T> entities, bool commit = true)
    {
        foreach (var entity in entities)
        {
            DeleteCore(entity, commit);
        }
    }
    public void Save(T entity, bool commit = true) => SaveCore(entity, commit);
    public void Update(T entity, bool commit = true) => UpdateCore(entity, commit);
    public T GetById<TKey>(TKey id, bool useInactive = false) => _dbContext!.Set<T>()!.Find(id)!;
    public T First(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters) => QueryCore(useInactive, includes, filters).FirstOrDefault()!;
    public IQueryable<T> GetAll(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters) => QueryCore(useInactive, includes, filters);
    public IQueryable<T> GetAllListOnly(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters) => QueryCore(useInactive, includes, filters).AsNoTracking();
    public long Count(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[] filters) => QueryCore(useInactive, includes, filters).Count<T>();
    #endregion

    #region IGenericCoreRepositoryAsync
    public async Task SaveAsync(T entity, bool commit = true) => await SaveCoreAsync(entity, commit);

    public async Task SaveRangeAsync(IEnumerable<T> entities, bool commit = true)
    {
        foreach (var entity in entities)
        {
            await SaveCoreAsync(entity, commit);
        }
    }
    public async Task UpdateAsync(T entity, bool commit = true) => await UpdateCoreAsync(entity, commit);
    public async Task DeleteAsync(T entity, bool commit = true) => await DeleteCoreAsync(entity, commit);
    public async Task<T> GetByIdAsync<TKey>(TKey id, bool useInactive = false) => await _dbContext.Set<T>().FindAsync(id);
    public async Task<T> FirstAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters)
        => await QueryCore(useInactive, includes, filters).FirstOrDefaultAsync();

    public async Task<long> CountAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters)
         => await QueryCore(useInactive, includes, filters).CountAsync();

    #endregion

    #region IDisposable
    ~GenericCoreRepository()
    {
        Dispose(false);
    }
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    protected virtual void Dispose(bool disposing)
    {
        if (!this.IsDisposed && disposing && _dbContext != null)
        {
            _dbContext.Dispose();
        }
        this.IsDisposed = true;
    }
    #endregion


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

    private static IQueryable<T> PerformInclusions(IEnumerable<Expression<Func<T, object>>>? includes, IQueryable<T> query) =>
        includes!.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

    public IQueryable<T> GetAllFiltered(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, QueryRequest? req = null)
           => QueryCore(useInactive: useInactive, includes: includes).ToDynamic(filters: req?.Filters, sorts: req?.Sorts);

}