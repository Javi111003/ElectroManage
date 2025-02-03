using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Application.Abstractions
{
    /// <summary>
    /// Provides functionality to check for uniqueness of entity names
    /// </summary>
    public interface ICheckUniqueService
    {
        /// <summary>
        /// Asynchronously checks if the name of the given entity is unique
        /// </summary>
        /// <typeparam name="T">The type of the entity to check</typeparam>
        /// <param name="entity">The entity whose name is to be checked for uniqueness</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean indicating whether the name is unique</returns>
        Task<bool> CheckUniqueNameAsync<T>(T entity) where T : class, IEntity;
    }
}