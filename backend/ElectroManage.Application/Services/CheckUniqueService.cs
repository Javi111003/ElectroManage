using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using Microsoft.EntityFrameworkCore;

namespace ElectroManage.Application.Services;

/// <summary>
/// Service to check the uniqueness of entity names within the application.
/// </summary>
[RegisterService<ICheckUniqueService>(LifeTime.Scoped)]
public class CheckUniqueService : ICheckUniqueService
{
    readonly IUnitOfWork UnitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="CheckUniqueService"/> class.
    /// </summary>
    /// <param name="unitOfWork">The unit of work to access the repository.</param>
    public CheckUniqueService(IUnitOfWork unitOfWork)
    {
        UnitOfWork = unitOfWork;
    }

    /// <summary>
    /// Checks if the name of a given entity is unique within its repository.
    /// </summary>
    /// <typeparam name="T">The type of the entity, which must implement <see cref="IEntity"/>.</typeparam>
    /// <param name="entity">The entity to check for uniqueness.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a boolean indicating whether the entity name is unique.</returns>
    /// <exception cref="InvalidOperationException">Thrown if the entity does not have a "Name" property.</exception>
    public async Task<bool> CheckUniqueNameAsync<T>(T entity) where T : class, IEntity
    {
        // Get the type of the entity to reflect on its properties
        var entityType = typeof(T);
        
        // Retrieve the "Id" and "Name" properties using reflection
        var idProp = entityType.GetProperty("Id");
        var nameProp = entityType.GetProperty("Name");
        
        // Throw an exception if the "Name" property is not found
        if (nameProp == null)
        {
            throw new InvalidOperationException($"La entidad {entityType.Name} no tiene una propiedad \"Name\" ");
        }
        
        // Access the repository for the entity type
        var entityRepository = UnitOfWork!.DbRepository<T>();
        
        // Retrieve all entities, including inactive ones, from the repository
        var entities = await entityRepository.GetAll(useInactive: true).ToListAsync();
        
        // Find an entity with the same name (case-insensitive) as the provided entity
        var result = entities.FirstOrDefault(e => nameProp.GetValue(entity)?.ToString()?.ToLower() == nameProp.GetValue(e)?.ToString()?.ToLower());
        
        var same = false;
        // If a matching entity is found and both have an "Id" property, check if they are the same entity
        if(result != null && idProp != null)
        {
            var entityId = idProp.GetValue(entity);
            var resultId = idProp.GetValue(result);
            same = entityId != null && resultId != null ? entityId.Equals(resultId) : false;
        }
        
        // Return true if no matching entity is found or if the found entity is the same as the provided one
        return result == null || same;
    }
}