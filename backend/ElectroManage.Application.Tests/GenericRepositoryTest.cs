using Moq;
using FluentAssertions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using ElectroManage.Domain.DataAccess.Concrete;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.DataAccess;


public abstract class GenericRepositoryTest<T> where T : Entity<long>
{
    protected readonly Mock<ApplicationDbContext> _mockContext;
    protected readonly GenericCoreRepository<T> _repository;
    protected GenericRepositoryTest()
    {
        _mockContext = new Mock<ApplicationDbContext>();
        _repository = new GenericCoreRepository<T>(_mockContext.Object);
    }
    public abstract T CreatedEntity();

    [Fact]
    public abstract Task AddAsync_Should_Add_Entity();

    [Fact]
    public async Task GetByIdAsync_Should_Return_Entity()
    {
        var entity = CreatedEntity();
        var id = entity.Id;
        var mockRepo = new Mock<GenericCoreRepository<T>>();

        //mockRepo.Setup(m => m.GetByIdAsync(It.IsAny<int>())). ojoooooooooooooooooooooooooooooo!!!!!!!!!!!!!!
        // Arrange
        _mockContext.Setup(m => m.Set<T>().FindAsync(id)).ReturnsAsync(entity);

        // Act
        var result = await _repository.GetByIdAsync(id);

        // Assert
        result.Should().Be(entity);
    }

    [Fact]
    public abstract Task GetByIdAsync_Should_Return_Null();

    [Fact]
    public abstract Task UpdateAsync_Should_Update_Entity();

    [Fact]
    public abstract Task DeleteAsync_Should_Delete_Entity();
}