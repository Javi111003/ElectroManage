using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Equipment;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Equipment
{
    public class EquipmentTypeRepositoryTest : GenericRepositoryTest<EquipmentType>
    {
        public override EquipmentType CreatedEntity()
        {
            return new EquipmentType
            {
                Id = 1,
                Name = "Test Type",
                Description = "Test Type Description"
            };
        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentType>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<EquipmentType>().FindAsync(id)).ReturnsAsync((EquipmentType)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentType>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentType>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EquipmentType>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EquipmentType>().Remove(entity), Times.Once);
        }
    }
}
