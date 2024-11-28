using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.DTO_s;

public record ListWarningsByCompanyResponse
{
    public long CompanyID { get; set; }
    public ICollection<WarningDTO> Warnings { get; set; } = [];
}
