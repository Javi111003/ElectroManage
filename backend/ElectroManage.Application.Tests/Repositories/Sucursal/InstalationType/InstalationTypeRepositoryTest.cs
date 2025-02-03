using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Sucursal;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Sucursal.InstalationType
{
    public class InstalationTypeRepositoryTest : GenericRepositoryTest<InstalationType>
    {
        public override InstalationType CreatedEntity()
        {
            return new InstalationType
            {
                Id = 1,
                Name = "Test Installation Type",
                Description = "Test Installation Description"
            };
        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<InstalationType>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<InstalationType>().FindAsync(id)).ReturnsAsync((InstalationType)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<InstalationType>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<InstalationType>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<InstalationType>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<InstalationType>().Remove(entity), Times.Once);
        }
    }
} 