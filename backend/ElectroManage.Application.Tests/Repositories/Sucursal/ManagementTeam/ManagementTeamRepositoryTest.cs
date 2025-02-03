using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites.Sucursal;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Sucursal.ManagementTeam
{
    public class ManagementTeamRepositoryTest : GenericRepositoryTest<ManagementTeam>
    {
        public override ManagementTeam CreatedEntity()
        {
            return new ManagementTeam
            {
                Id = 1,
                Name = "Test Management Team",
                CompanyId = 1
                // No incluimos Company ni Members ya que son navegación
            };
        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ManagementTeam>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<ManagementTeam>().FindAsync(id)).ReturnsAsync((ManagementTeam)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<ManagementTeam>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ManagementTeam>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<ManagementTeam>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ManagementTeam>().Remove(entity), Times.Once);
        }
    }
} 