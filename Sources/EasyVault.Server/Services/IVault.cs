using EasyVault.Server.Models;

namespace EasyVault.Server.Services
{
    public interface IVault
    {
        bool IsSealed { get; }
        VaultSecret? GetSecrets(Guid keyId);
        void Unseal(IEnumerable<VaultSecret> secrets);
    }
}
