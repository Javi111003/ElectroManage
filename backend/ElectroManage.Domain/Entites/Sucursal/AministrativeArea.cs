﻿using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class AministrativeArea : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
}