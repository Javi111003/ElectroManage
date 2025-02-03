using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Sucursal;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Register
{
    public class RegisterRepositoryTest : GenericRepositoryTest<ElectroManage.Domain.Entites.Sucursal.Register>
    {
        public override ElectroManage.Domain.Entites.Sucursal.Register CreatedEntity()
        {
            return new ElectroManage.Domain.Entites.Sucursal.Register
            {
                Id = 1,
                Date = DateTime.Now,
                Cost = 100.50,
                Consumption = 50.75,
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
            _mockContext.Verify(m => m.Set<ElectroManage.Domain.Entites.Sucursal.Register>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<ElectroManage.Domain.Entites.Sucursal.Register>().FindAsync(id)).ReturnsAsync((ElectroManage.Domain.Entites.Sucursal.Register)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<ElectroManage.Domain.Entites.Sucursal.Register>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ElectroManage.Domain.Entites.Sucursal.Register>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<ElectroManage.Domain.Entites.Sucursal.Register>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ElectroManage.Domain.Entites.Sucursal.Register>().Remove(entity), Times.Once);
        }
    }
} 