
using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public class CreateEfficiencyPolicyCommandHandler : CoreCommandHandler<CreateEfficienciPolicyCommand, EfficiencyPolicyDTO>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEfficiencyPolicyCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;

    public CreateEfficiencyPolicyCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEfficiencyPolicyCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<EfficiencyPolicyDTO> ExecuteAsync(CreateEfficienciPolicyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var efficiencyPoliciesRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var efficiencyPolicy = new Domain.Entites.Sucursal.EfficiencyPolicy
        {
            Name = command.Name,
            Description = command.Description,
        };

        var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(efficiencyPolicy);
        if (!checkUniqueName)
        {
            _logger.LogError("This efficiency policies name already exists");
            ThrowError("This efficiency policies name already exists", 404);
        }

        await efficiencyPoliciesRepository.SaveAsync(efficiencyPolicy, false);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await _unitOfWork.SaveChangesAsync();
        return EfficiencyPolicyMapper.MapToEfficiencyPolicyDTO(efficiencyPolicy);
    }
}
