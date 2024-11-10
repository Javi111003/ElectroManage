namespace ElectroManage.Domain.DataAccess.Abstractions;
public interface IUnitOfWork : IDisposable
{
    IGenericCoreRepositoryAsync<TEntity> DbRepository<TEntity>() where TEntity : class;
    int CommitChanges(bool autoRollbackOnError = true);
    Task<int> CommitChangesAsync(bool autoRollbackOnError = true);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    void RollBack();
    void BeginTransaction();
    bool CommitTransaction();
}