using FluentAssertions;
using Moq;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Sucursal.Location

{
    public class LocationRepositoryTest : GenericRepositoryTest<ElectroManage.Domain.Entites.Location>
    {
        public override ElectroManage.Domain.Entites.Location CreatedEntity()
        {
            return new ElectroManage.Domain.Entites.Location
            {
                Id = 1,
                AddressDetails = "Test Address",
                Latitude = 40.416775,
                Longitude = -3.703790
            };
        }

        public override async Task AddAsync_Should_Add_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            
            // Act
            await _repository.SaveAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ElectroManage.Domain.Entites.Location>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<ElectroManage.Domain.Entites.Location>().FindAsync(id)).ReturnsAsync((ElectroManage.Domain.Entites.Location)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<ElectroManage.Domain.Entites.Location>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ElectroManage.Domain.Entites.Location>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<ElectroManage.Domain.Entites.Location>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<ElectroManage.Domain.Entites.Location>().Remove(entity), Times.Once);
        }
    }
} 