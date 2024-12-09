using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Location.Command.Delete;

public class DeleteLocationCommandHandler : CoreCommandHandler<DeleteLocationCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteLocationCommandHandler> _logger;

    public DeleteLocationCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteLocationCommandHandler> logger) : base(unitOfWork)    
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteLocationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var locationRepository = _unitOfWork.DbRepository<Domain.Entites.Location>();
        var location = await locationRepository.FirstAsync(useInactive: true, filters: x=>x.Id == command.Id);
        if (location is null)
        {
            _logger.LogError($"Location with id: {command.Id} not found");
            ThrowError($"Location with id: {command.Id} not found", 404);
        }
        location.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await locationRepository.UpdateAsync(location);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
