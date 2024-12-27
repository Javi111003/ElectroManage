
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Office.Query.Get;

public class ListOfficeCommandHandler : CoreCommandHandler<ListOfficeCommand, ListOfficeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListOfficeCommandHandler> _logger;

    public ListOfficeCommandHandler(IUnitOfWork unitOfWork, ILogger<ListOfficeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListOfficeResponse> ExecuteAsync(ListOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var offices = (await officeRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new OfficeDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new ListOfficeResponse
        {
            Offices = offices
        };
    }
}
