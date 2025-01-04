﻿using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class EfficiencyPolicyConfiguration : IEntityTypeConfiguration<EfficiencyPolicy>
{
    public void Configure(EntityTypeBuilder<EfficiencyPolicy> builder)
    {
        builder.HasKey(ep => ep.Id);

        builder.HasMany(ep => ep.Companies)
            .WithMany(c => c.EfficiencyPolicies);
    }
}