using System.Linq.Expressions;

namespace ElectroManage.Domain.DataAccess.Abstractions;
public interface IGenericCoreRepositoryAsync<T> : IGenericCoreRepository<T> where T : class
{
    Task SaveAsync(T entity, bool commit = true);
    Task SaveRangeAsync(IEnumerable<T> entities, bool commit = true);
    Task UpdateAsync(T entity, bool commit = true);
    Task DeleteAsync(T entity, bool commit = true);
    Task<T> GetByIdAsync<TKey>(TKey id, bool useInactive = false);
    Task<T> FirstAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
    Task<long> CountAsync(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
}