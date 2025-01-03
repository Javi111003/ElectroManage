using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
namespace ElectroManage.Application.Features.Office.Command.Delete;

public class DeleteOfficeCommandHandler : CoreCommandHandler<DeleteOfficeCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteOfficeCommandHandler> _logger;

    public DeleteOfficeCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteOfficeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var office = await officeRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (office is null)
        {
            _logger.LogError($"Office with id {command.Id} not found");
            ThrowError($"Office with id {command.Id} not found", 404);
        }
        office.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await officeRepository.UpdateAsync(office);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
