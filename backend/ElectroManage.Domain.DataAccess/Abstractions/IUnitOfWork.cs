namespace ElectroManage.Domain.DataAccess.Abstractions;

/// <summary>
/// Defines the contract for the Unit of Work pattern implementation
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Gets a repository instance for the specified entity type
    /// </summary>
    /// <typeparam name="TEntity">The type of entity for which to get the repository</typeparam>
    /// <returns>A repository instance that can perform operations on the specified entity type</returns>
    IGenericCoreRepositoryAsync<TEntity> DbRepository<TEntity>() where TEntity : class;

    /// <summary>
    /// Commits all pending changes from registered repositories
    /// </summary>
    /// <param name="autoRollbackOnError">If true, automatically rolls back all changes if any error occurs during commit</param>
    /// <returns>The total number of changes committed across all repositories</returns>
    int CommitChanges(bool autoRollbackOnError = true);

    /// <summary>
    /// Asynchronously commits all pending changes from registered repositories
    /// </summary>
    /// <param name="autoRollbackOnError">If true, automatically rolls back all changes if any error occurs during commit</param>
    /// <returns>A task representing the commit operation with the total number of changes</returns>
    Task<int> CommitChangesAsync(bool autoRollbackOnError = true);

    /// <summary>
    /// Asynchronously saves all pending changes to the database
    /// </summary>
    /// <param name="cancellationToken">A token to cancel the save operation</param>
    /// <returns>A task representing the save operation with the number of affected records</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current transaction, undoing any pending changes
    /// </summary>
    void RollBack();

    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    void BeginTransaction();

    /// <summary>
    /// Commits the current transaction to the database
    /// </summary>
    /// <returns>True if the commit was successful, false otherwise</returns>
    bool CommitTransaction();
}