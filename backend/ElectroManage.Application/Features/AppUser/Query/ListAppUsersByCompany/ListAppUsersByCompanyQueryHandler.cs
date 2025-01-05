using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsersByCompany;

public class ListAppUsersByCompanyQueryHandler : CoreQueryHandler<ListAppUsersByCompanyQuery, IEnumerable<AppUserDto>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListAppUsersByCompanyQueryHandler> _logger;

    public ListAppUsersByCompanyQueryHandler(IUnitOfWork unitOfWork, ILogger<ListAppUsersByCompanyQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<AppUserDto>> ExecuteAsync(ListAppUsersByCompanyQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var userRepository = _unitOfWork.DbRepository<Domain.Entites.Identity.AppUser>();
        var include = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} not found");
            ThrowError($"Company with id {command.CompanyId} not found", 404);
        }
        var users = userRepository.GetAll(useInactive:true , filters: x => x.CompanyId == command.CompanyId, includes: include);
        return AppUserMapper.MapToListUsersResponse(users);
    }
}