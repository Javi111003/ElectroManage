﻿using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class EfficiencyPolicy : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ApplyingDate { get; set; }
    public ICollection<Company> Companies { get; set; } = null!; 
}