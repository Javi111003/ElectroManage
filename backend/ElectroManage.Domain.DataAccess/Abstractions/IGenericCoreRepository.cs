using ElectroManage.Common.Dtos;
using System.Linq.Expressions;

namespace ElectroManage.Domain.DataAccess.Abstractions;

public interface IGenericCoreRepository<T> : ICommitable where T : class
{
    void Delete(T entity, bool commit = true);
    void DeleteRange(IEnumerable<T> entities, bool commit = true);
    void Delete(params Expression<Func<T, bool>>[] filters);
    void Save(T entity, bool commit = true);
    void Update(T entity, bool commit = true);
    T GetById<TKey>(TKey id, bool useInactive = false);
    T First(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
    IQueryable<T> GetAll(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
    IQueryable<T> GetAllListOnly(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[]? filters);
    IQueryable<T> GetAllFiltered(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, QueryRequest? req = null);
    long Count(bool useInactive = false, IEnumerable<Expression<Func<T, object>>>? includes = null, params Expression<Func<T, bool>>[] filters);
}