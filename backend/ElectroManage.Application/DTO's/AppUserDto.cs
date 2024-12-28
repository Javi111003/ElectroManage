﻿namespace ElectroManage.Application.DTO_s;
public record AppUserDto
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public CompanyDTO Company { get; set; } = null!;
}