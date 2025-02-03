using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Moq;
using ElectroManage.Domain.Entites;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Sucursal.Location

{
    public class LocationRepositoryTest : GenericRepositoryTest<Location>
    {
        public override Location CreatedEntity()
        {
            return new Location
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
            _mockContext.Verify(m => m.Set<Location>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<Location>().FindAsync(id)).ReturnsAsync((Location)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Location>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Location>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Location>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Location>().Remove(entity), Times.Once);
        }
    }
} 