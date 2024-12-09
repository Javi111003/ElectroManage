
using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Post;

public class CreateAdministrativeAreaCommandHandler : CoreCommandHandler<CreateAdministrativeAreaCommand, CreateAdministrativeAreaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateAdministrativeAreaCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;
    public CreateAdministrativeAreaCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateAdministrativeAreaCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<CreateAdministrativeAreaResponse> ExecuteAsync(CreateAdministrativeAreaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var administrativeAreaReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();

        var administrativeArea = new Domain.Entites.Sucursal.AministrativeArea
        {
            Name = command.Name,
            Description = command.Description,
            Created = DateTime.Now
        };
        var UniqueName = await _checkUniqueService.CheckUniqueNameAsync(administrativeArea);
        if (!UniqueName)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This name already exists");
            ThrowError("This name already exists", 400);
        }
        await administrativeAreaReporitory.SaveAsync(administrativeArea,false);
        await UnitOfWork!.SaveChangesAsync();
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
