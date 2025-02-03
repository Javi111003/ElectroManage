using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Equipment;
using ElectroManage.Domain.Enums.Equipment;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Equipment
{
    public class EquipmentInstanceRepositoryTest : GenericRepositoryTest<EquipmentInstance>
    {
        public override EquipmentInstance CreatedEntity()
        {
            return new EquipmentInstance
            {
                Id = 1,
                InstalationDate = DateTime.Now,
                MantainceStatus = MaintenanceStatus.Good,
                UseFrequency = UseFrequency.High,
                EquipmentSpecificationId = 1,
                OfficeId = 1
            };
        }
        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentInstance>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<EquipmentInstance>().FindAsync(id)).ReturnsAsync((EquipmentInstance)null);
            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentInstance>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentInstance>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentInstance>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentInstance>().Remove(entity), Times.Once);
        }
    }
} 