using ElectroManage.Domain.DataAccess.Abstractions;

namespace ElectroManage.Application;
public abstract class CoreQueryHandler<TRequest, TResponse> : CoreApplicationService<TRequest, TResponse> where TRequest : class, ICommand<TResponse>
{
    protected CoreQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
    protected CoreQueryHandler()
    {
    } 
    public abstract override Task<TResponse> ExecuteAsync(TRequest command, CancellationToken ct = default);
}