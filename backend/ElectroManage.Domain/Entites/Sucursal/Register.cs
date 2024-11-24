﻿using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class Register : Entity<long>
{
    public DateTime Date { get; set; }
    public decimal Cost { get; set; }
    public decimal Consumption { get; set; }
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
}