using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public record CreateEfficiencyPolicyResponse
{
    public long Id { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty; 
    public DateTime Created { get; set; }
}