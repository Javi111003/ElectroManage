
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Post;

public class CreateAdministrativeAreaCommandHandler : CoreCommandHandler<CreateAdministrativeAreaCommand, CreateAdministrativeAreaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateAdministrativeAreaCommandHandler> _logger;

    public CreateAdministrativeAreaCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateAdministrativeAreaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateAdministrativeAreaResponse> ExecuteAsync(CreateAdministrativeAreaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var administrativeAreaReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var checkUniqueName = await administrativeAreaReporitory.CountAsync(useInactive: true, filters: x=>x.Name == command.Name);
        if (checkUniqueName > 0)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This name already exists");
            ThrowError("This name already exists", 400);
        }

        var administrativeArea = new Domain.Entites.Sucursal.AministrativeArea
        {
            Name = command.Name,
            Description = command.Description,
            Created = command.Created,
        };

        await administrativeAreaReporitory.SaveAsync(administrativeArea);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateAdministrativeAreaResponse
        {
            Id = administrativeArea.Id,
            Name = administrativeArea.Name,
            Description = administrativeArea.Description,
            Created = administrativeArea.Created,
        };
    }
}
