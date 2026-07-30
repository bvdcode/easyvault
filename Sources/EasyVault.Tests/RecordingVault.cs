using EasyVault.Server.Models;
using EasyVault.Server.Services;

namespace EasyVault.Tests
{
    internal class RecordingVault : IVault
    {
        private readonly Dictionary<Guid, VaultSecret> _secrets = [];

        public bool IsSealed => _secrets.Count == 0;

        public VaultSecret? GetSecrets(Guid keyId)
        {
            return _secrets.GetValueOrDefault(keyId);
        }

        public void Unseal(IEnumerable<VaultSecret> secrets)
        {
            foreach (VaultSecret secret in secrets)
            {
                _secrets[secret.KeyId] = secret;
            }
        }
    }
}
