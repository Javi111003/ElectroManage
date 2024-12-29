using ElectroManage.Application.DTO_s;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountOffice;

public record GetTopFiveCompaniesCountOfficeResponse
{
    public IEnumerable<TopFiveCompanyCountOfficeDTO> TopFiveCompanyCounts { get; set; } = new HashSet<TopFiveCompanyCountOfficeDTO>();
}
