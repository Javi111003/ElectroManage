using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using Policy = ElectroManage.Domain.Entites.Sucursal.EfficiencyPolicy;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.EfficiencyPolicy
{
    public class EfficiencyPolicyRepositoryTest : GenericRepositoryTest<Policy>
    {
        public override Policy CreatedEntity()
        {
            return new Policy
            {
                Id = 1,
                Name = "Test Policy",
                Description = "Test Policy Description"
            };
        }


        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Policy>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<Policy>().FindAsync(id)).ReturnsAsync((Policy)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Policy>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Policy>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Policy>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Policy>().Remove(entity), Times.Once);
        }
    }
} 