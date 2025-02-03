using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Equipment;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Equipment
{
    public class EquipmentSpecificationRepositoryTest : GenericRepositoryTest<EquipmentSpecification>
    {
        public override EquipmentSpecification CreatedEntity()
        {
            return new EquipmentSpecification
            {
                Id = 1,
                Model = "Test Model",
                Capacity = 100.0m,
                CriticalEnergySystem = true,
                AverageConsumption = 50.0m,
                LifeSpanYears = 5,
                Efficiency = 0.85m,
                EquipmentBrandId = 1,
                EquipmentTypeId = 1
            };
        }
        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentSpecification>().AddAsync(entity, default), Times.Once);

        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<EquipmentSpecification>().FindAsync(id)).ReturnsAsync((EquipmentSpecification)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentSpecification>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentSpecification>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentSpecification>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentSpecification>().Remove(entity), Times.Once);
        }
    }
} 