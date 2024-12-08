
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Query.Get;

public class RegisterGetByIdCommandHandler : CoreCommandHandler<RegisterGetByIdCommand, RegisterGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<RegisterGetByIdCommandHandler> _logger;

    public RegisterGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<RegisterGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<RegisterGetByIdResponse> ExecuteAsync(RegisterGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var registerRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Register>();
        var register = await registerRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new RegisterGetByIdResponse
        {
            Cost = register.Cost,
            Consumption = register.Consumption,
            Date = register.Date,
        };
    }
}
