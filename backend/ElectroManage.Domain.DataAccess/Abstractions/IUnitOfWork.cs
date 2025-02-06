namespace ElectroManage.Domain.DataAccess.Abstractions;
/// <summary>
/// Represents a unit of work that coordinates changes across a set of repositories.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Gets the generic repository for the specified entity.
    /// </summary>
    /// <typeparam name="TEntity">The type of the entity.</typeparam>
    /// <returns>The generic repository for the specified entity.</returns>
    IGenericCoreRepositoryAsync<TEntity> DbRepository<TEntity>() where TEntity : class;

    /// <summary>
    /// Commits the changes made in the context.
    /// </summary>
    /// <param name="autoRollbackOnError">Indicates whether to automatically rollback in case of an error.</param>
    /// <returns>The number of affected objects.</returns>
    int CommitChanges(bool autoRollbackOnError = true);

    /// <summary>
    /// Commits the changes made in the context asynchronously.
    /// </summary>
    /// <param name="autoRollbackOnError">Indicates whether to automatically rollback in case of an error.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the number of affected objects.</returns>
    Task<int> CommitChangesAsync(bool autoRollbackOnError = true);

    /// <summary>
    /// Saves the changes made in the context asynchronously.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the number of affected objects.</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the changes made in the context.
    /// </summary>
    void RollBack();

    /// <summary>
    /// Begins a new transaction.
    /// </summary>
    void BeginTransaction();

    /// <summary>
    /// Commits the current transaction.
    /// </summary>
    /// <returns>True if the transaction was committed successfully; otherwise, false.</returns>
    bool CommitTransaction();
}
