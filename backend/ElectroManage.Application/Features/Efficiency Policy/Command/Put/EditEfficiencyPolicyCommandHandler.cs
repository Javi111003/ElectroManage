
using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

public class EditEfficiencyPolicyCommandHandler : CoreCommandHandler<EditEfficiencyPolicyCommand, EfficiencyPolicyDTO>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEfficiencyPolicyCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;
    public EditEfficiencyPolicyCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEfficiencyPolicyCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<EfficiencyPolicyDTO> ExecuteAsync(EditEfficiencyPolicyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var efficiencyPolicyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.EfficiencyPolicy, bool>>[]
        {
            x => x.Id == command.Id
        };
        var efficiencyPolicy = await efficiencyPolicyRepository.FirstAsync(useInactive: true, filters: filter);
        if (efficiencyPolicy is null)
        {
            _logger.LogError("Efficiency Policy not found");
            ThrowError("Efficiency Policy not found", 404);
        }
        using (var scopeDoWork = ScopeBeginTransactionAsync())
        {
            efficiencyPolicy.Name = command.Name;
            efficiencyPolicy.Description = command.Description;
            var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(efficiencyPolicy);
            if (!checkUniqueName)
            {
                _logger.LogError("This Policy's name already exists");
                ThrowError("This Policy's name already exists", 404);
            }
            await efficiencyPolicyRepository.UpdateAsync(efficiencyPolicy, false);
            CommitTransaction(scopeDoWork);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return EfficiencyPolicyMapper.MapToEfficiencyPolicyDTO(efficiencyPolicy);
    }
}
