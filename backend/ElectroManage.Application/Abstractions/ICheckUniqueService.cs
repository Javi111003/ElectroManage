using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Application.Abstractions;
public interface ICheckUniqueService
{
    public Task<bool> CheckUniqueNameAsync<T>(T entity) where T : class , IEntity;
}