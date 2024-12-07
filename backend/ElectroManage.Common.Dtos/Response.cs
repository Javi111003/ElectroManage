namespace ElectroManage.Common.Dtos;

public class Response<T>
{
    public T? Data { get; set; }
    public string? Message { get; set; }
    public static Response<T> SuccessWithData(T data) => new() { Data = data };
    public static Response<T> SuccessWithOutData(string? message = "Ok") => new() { Message = message };
}
