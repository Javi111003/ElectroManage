using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ListAllGeneralData;

public class ListAllCompaniesGeneralDataCommandHandler : CoreCommandHandler<ListAllCompaniesGeneralDataCommand, ListAllCompaniesGeneralDataResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListAllCompaniesGeneralDataCommandHandler> _logger;

    public ListAllCompaniesGeneralDataCommandHandler(IUnitOfWork unitOfWork, ILogger<ListAllCompaniesGeneralDataCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListAllCompaniesGeneralDataResponse> ExecuteAsync(ListAllCompaniesGeneralDataCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companiesRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.InstalationType,
            x => x.ManagementTeam,
            x => x.Location,
        };
        var companies = await companiesRepository.GetAll(useInactive: true, includes: include)
            .Select(x => new CompanyGeneralDataDTO
            {
                Id = x.Id,
                Name = x.Name,
                InstallationType = x.InstalationType.Name,
                ConsumptionLimit = x.ConsumptionLimit,
                MaganamentTeam = x.ManagementTeam.Name!,
                Location = new LocationDTO
                {
                    AddressDetails = x.Location.AddressDetails,
                    CoordenateDTO = new CoordenateDTO
                    {
                        Latitude = x.Location.Latitude,
                        Longitude = x.Location.Longitude
                    }
                }
            }).ToListAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new ListAllCompaniesGeneralDataResponse
        {
            Companies = companies,
        };
    }
}
