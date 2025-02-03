using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Equipment;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Equipment
{
    public class EquipmentBrandRepositoryTest : GenericRepositoryTest<EquipmentBrand>
    {
        public override EquipmentBrand CreatedEntity()
        {
            return new EquipmentBrand
            {
                Id = 1,
                Name = "Test Brand",
                Description = "Test Brand Description"
            };
        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentBrand>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<EquipmentBrand>().FindAsync(id)).ReturnsAsync((EquipmentBrand)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentBrand>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentBrand>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentBrand>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentBrand>().Remove(entity), Times.Once);
        }
    }
} 