using EasyVault.Server.Models;
using EasyVault.Server.Services;

namespace EasyVault.Tests
{
    public class MemoryVaultServiceTests
    {
        [Test]
        public void GetSecrets_ShouldReturnNull_WhenKeyDoesNotExist()
        {
            var vault = new MemoryVaultService();
            vault.Unseal(
            [
                new VaultSecret
                {
                    AppName = "test",
                    KeyId = Guid.NewGuid(),
                    Values = new Dictionary<string, string>
                    {
                        ["secret"] = "value"
                    }
                }
            ]);

            VaultSecret? result = vault.GetSecrets(Guid.NewGuid());

            Assert.That(result, Is.Null);
        }
    }
}
