using FluentAssertions;
using Moq;
using Instalation = ElectroManage.Domain.Entites.Sucursal.InstalationType;
using ElectroManage.Application.Tests.Base;

namespace ElectroManage.Application.Tests.Repositories.Sucursal.InstalationType
{
    public class InstalationTypeRepositoryTest : GenericRepositoryTest<Instalation>
    {
        public override Instalation CreatedEntity()
        {
            return new Instalation
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
            _mockContext.Verify(m => m.Set<Instalation>().AddAsync(entity, default), Times.Once);
        }

        public override async Task GetByIdAsync_Should_Return_Null()
        {
            // Arrange
            long id = 999;
            _mockContext.Setup(m => m.Set<Instalation>().FindAsync(id)).ReturnsAsync((Instalation)null);

            // Act
            var result = await _repository.GetByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        public override async Task UpdateAsync_Should_Update_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Instalation>().Update(entity));

            // Act
            await _repository.UpdateAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Instalation>().Update(entity), Times.Once);
        }

        public override async Task DeleteAsync_Should_Delete_Entity()
        {
            // Arrange
            var entity = CreatedEntity();
            _mockContext.Setup(m => m.Set<Instalation>().Remove(entity));

            // Act
            await _repository.DeleteAsync(entity);

            // Assert
            _mockContext.Verify(m => m.Set<Instalation>().Remove(entity), Times.Once);
        }
    }
} 