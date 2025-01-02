
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.ListAll;

public class ListAllCompaniesCommandHandler : CoreCommandHandler<ListAllCompaniesCommand, ListAllCompaniesResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListAllCompaniesCommandHandler> _logger;

    public ListAllCompaniesCommandHandler(IUnitOfWork unitOfWork, ILogger<ListAllCompaniesCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListAllCompaniesResponse> ExecuteAsync(ListAllCompaniesCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companiesRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var companies = await companiesRepository.GetAll(useInactive: true)
            .Select(x => new CompanyDTO 
            {
                Id = x.Id,
                Name = x.Name,
            }).ToListAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new ListAllCompaniesResponse 
        {
            Companies = companies, 
        };
    }
}
