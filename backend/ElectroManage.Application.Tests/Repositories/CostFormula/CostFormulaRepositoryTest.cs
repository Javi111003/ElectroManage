using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Sucursal;
using ElectroManage.Application.Tests.Base;
using Formula = ElectroManage.Domain.Entites.Sucursal.CostFormula;

namespace ElectroManage.Application.Tests.Repositories.CostFormula
{
    public class CostFormulaRepositoryTest : GenericRepositoryTest<Formula>
    {
        public override Formula CreatedEntity()
        {
            return new Formula
            {
                Id = 1,
                Name = "Test Formula",
                Expression = "x * y + z",
                ApplyingDate = DateTime.Now,
                CompanyId = 1
            };

        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Formula>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<Formula>().FindAsync(id)).ReturnsAsync((Formula)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Formula>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Formula>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Formula>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Formula>().Remove(entity), Times.Once);
        }
    }
} 