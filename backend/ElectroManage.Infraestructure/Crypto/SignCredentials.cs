using Microsoft.IdentityModel.Tokens;

namespace ElectroManage.Infraestructure.Crypto;
public class SigningCredentialsHelper
{
    public static SigningCredentials CreateSigningCredentials(SecurityKey securityKey)
    {
        return new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);
    }
}