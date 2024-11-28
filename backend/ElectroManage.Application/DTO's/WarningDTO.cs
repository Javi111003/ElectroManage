using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.DTO_s;
public record WarningDTO
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal EstablishedLimit { get; set; }
    public decimal Consumption { get; set; }
}
