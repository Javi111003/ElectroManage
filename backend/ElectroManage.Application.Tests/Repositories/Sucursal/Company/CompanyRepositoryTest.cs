using FluentAssertions;
using Moq;
using Center = ElectroManage.Domain.Entites.Sucursal.Company;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Sucursal.Company
{
    public class CompanyRepositoryTest : GenericRepositoryTest<Center>
    {

        public override Center CreatedEntity()
        {
            return new Center
            {
                Id = 1,
                Name = "Test Company",
                ConsumptionLimit = 1000.00m,
                InstalationTypeId = 1,
                AministrativeAreaId = 1,
                LocationId = 1,
                ManagementTeamId = 1,
            };
        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Center>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<Center>().FindAsync(id)).ReturnsAsync((Center)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Center>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Center>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Center>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Center>().Remove(entity), Times.Once);
        }
    }
} 