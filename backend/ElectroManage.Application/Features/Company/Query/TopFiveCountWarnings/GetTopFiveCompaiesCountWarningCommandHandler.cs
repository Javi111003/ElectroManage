﻿using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountWarnings;

public class GetTopFiveCompaiesCountWarningCommandHandler : CoreCommandHandler<GetTopFiveCompaiesCountWarningCommand, IEnumerable<TopFiveCompaniesCountWarningDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetTopFiveCompaiesCountWarningCommandHandler> _logger;

    public GetTopFiveCompaiesCountWarningCommandHandler(IUnitOfWork unitOfWork, ILogger<GetTopFiveCompaiesCountWarningCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<TopFiveCompaniesCountWarningDTO>> ExecuteAsync(GetTopFiveCompaiesCountWarningCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Warnings
        };
        var topFiveCompaniesCountWarnings = await companyRepository.GetAll(useInactive: true)
            .Select(x => new TopFiveCompaniesCountWarningDTO
            {
                Company = new CompanyDTO
                {
                    Id = x.Id,
                    Name = x.Name,
                },
                CountWarning = x.Warnings.Count(),
            }).Take(5).OrderBy(x => x.CountWarning).ToListAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return topFiveCompaniesCountWarnings;
    }
}