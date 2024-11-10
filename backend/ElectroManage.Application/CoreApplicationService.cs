using ElectroManage.Domain.DataAccess.Abstractions;
using System.Transactions;

namespace ElectroManage.Application;
public abstract class CoreApplicationService<TRequest, TResponse> :
    CommandHandler<TRequest, TResponse> where TRequest : class, ICommand<TResponse>
{
    protected IUnitOfWork? UnitOfWork { get; set; }
    protected CoreApplicationService(IUnitOfWork unitOfWork)
    {
        UnitOfWork = unitOfWork;
    }
    protected CoreApplicationService()
    {
    }
    protected TransactionScope ScopeBeginTransactionAsync() => new(TransactionScopeAsyncFlowOption.Enabled);
    protected TransactionScope ScopeBeginTransaction(TransactionScopeOption option, IsolationLevel level)
    {
        return new TransactionScope(option, new TransactionOptions()
        {
            IsolationLevel = level
        });
    }
    protected void CommitTransaction(TransactionScope scopeInCurse) => scopeInCurse.Complete();
    protected async Task<int> CommitAsync() => await UnitOfWork!.SaveChangesAsync();
}