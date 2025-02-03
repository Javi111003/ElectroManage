using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Application.Abstractions;
/// <summary>
/// Interface for checking the uniqueness of entity names.
/// </summary>
public interface ICheckUniqueService
{
    /// <summary>
    /// Checks if the name of the given entity is unique.
    /// </summary>
    /// <typeparam name="T">The type of the entity.</typeparam>
    /// <param name="entity">The entity to check.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the name is unique.</returns>
    public Task<bool> CheckUniqueNameAsync<T>(T entity) where T : class, IEntity;
}