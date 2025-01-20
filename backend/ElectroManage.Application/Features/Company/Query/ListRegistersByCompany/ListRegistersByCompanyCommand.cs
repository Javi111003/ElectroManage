﻿using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListRegistersByCompany;

public record ListRegistersByCompanyCommand : ICommand<IEnumerable<RegisterDTO>>
{
    public long Id { get; set; }
    public DateTime Start {  get; set; }
    public DateTime End { get; set; }
}
