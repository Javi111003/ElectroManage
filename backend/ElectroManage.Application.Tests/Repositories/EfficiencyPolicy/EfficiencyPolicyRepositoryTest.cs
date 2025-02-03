using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Sucursal;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.EfficiencyPolicy
{
    public class EfficiencyPolicyRepositoryTest : GenericRepositoryTest<EfficiencyPolicy>
    {
        public override EfficiencyPolicy CreatedEntity()
        {
            return new EfficiencyPolicy
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
            _mockContext.Verify(m => m.Set<EfficiencyPolicy>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<EfficiencyPolicy>().FindAsync(id)).ReturnsAsync((EfficiencyPolicy)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EfficiencyPolicy>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EfficiencyPolicy>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<EfficiencyPolicy>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<EfficiencyPolicy>().Remove(entity), Times.Once);
        }
    }
} 