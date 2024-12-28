using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ElectroManage.Infraestructure.Crypto;
public class SecurityEncrypt
{
    public static SecurityKey CreateSecurityKey(string securityKey)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
    }
}