using ElectroManage.Application.DTO_s;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Features.Company.Query.CountDeleteCompanies;

public record CountDeleteCompaniesResponse
{
    public long CreatedComapniesThisYear { get; set; }
    public long ExistingCompaniesThisYear { get; set; }
    public long DeletedCompaniesThisYear { get; set; }
}
