using ElectroManage.Application.Features.InstallationType.Command.Delete;
using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Command.Delete;

public class DeleteRegisterCommandHandler : CoreCommandHandler<DeleteRegisterCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteInstallationTypeCommandHandler> _logger;

    public DeleteRegisterCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteInstallationTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteRegisterCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var registerRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Register>();
        var register = await registerRepository.FirstAsync(useInactive: true, filters: x=>x.Id == command.Id);
        if(register is null)
        {
            _logger.LogError($"Register with id: {command.Id} not found");
            ThrowError($"Register with id: {command.Id} not found", 404);
        }
        register.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await registerRepository.UpdateAsync(register, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
