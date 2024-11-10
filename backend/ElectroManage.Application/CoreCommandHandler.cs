using ElectroManage.Domain.DataAccess.Abstractions;

namespace ElectroManage.Application;
public abstract class CoreCommandHandler<TRequest, TResponse> : CoreApplicationService<TRequest, TResponse> where TRequest : class , ICommand<TResponse>
{
    protected CoreCommandHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
    protected CoreCommandHandler()
    {
    }
    public abstract override Task<TResponse> ExecuteAsync(TRequest command, CancellationToken ct = default);
}