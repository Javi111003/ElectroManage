using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Command.Put;
public class EditGeneralDataRegisterCommandHandler : CoreCommandHandler<EditGeneralDataRegisterCommand, EditGeneralDataRegisterResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditGeneralDataRegisterCommandHandler> _logger;
    public EditGeneralDataRegisterCommandHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataRegisterCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<EditGeneralDataRegisterResponse> ExecuteAsync(EditGeneralDataRegisterCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution starter");
        var registerRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Register>();
        var register = await registerRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (register is null)
        {
            _logger.LogError($"The register with the id: {command.Id} not found");
            ThrowError($"The register with the id: {command.Id} not found", 404);
        }
        register.Consumption = command.Consumption;
        register.Cost = command.Cost;
        register.Date = command.Date;
        await registerRepository.UpdateAsync(register);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditGeneralDataRegisterResponse
        {
            Id = register.Id,
            Cost = register.Cost,
            Consumption = register.Consumption,
            Date = register.Date,
        };
    }
}