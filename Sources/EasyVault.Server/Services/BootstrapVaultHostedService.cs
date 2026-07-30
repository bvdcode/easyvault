using EasyExtensions.Extensions;
using EasyVault.Server.Database;
using EasyVault.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EasyVault.Server.Services
{
    public class BootstrapVaultHostedService(
        IConfiguration configuration,
        IServiceScopeFactory serviceScopeFactory,
        IVault vault,
        ILogger<BootstrapVaultHostedService> logger) : IHostedService
    {
        private const string BootstrapSecretConfigurationKey = "BOOTSTRAP_SECRET";

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            string? bootstrapSecret = configuration[BootstrapSecretConfigurationKey];
            if (string.IsNullOrWhiteSpace(bootstrapSecret))
            {
                return;
            }

            await using AsyncServiceScope scope = serviceScopeFactory.CreateAsyncScope();
            AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            string keyHash = bootstrapSecret.Sha512();
            Vault? storedVault = await dbContext.Vaults
                .AsNoTracking()
                .OrderByDescending(candidate => candidate.CreatedAt)
                .FirstOrDefaultAsync(
                    candidate => candidate.SecretKeyHashSha512 == keyHash,
                    cancellationToken);

            if (storedVault is null)
            {
                logger.LogWarning(
                    "No persisted vault matches {ConfigurationKey}. The vault remains sealed.",
                    BootstrapSecretConfigurationKey);
                return;
            }

            VaultSecret[] secrets = storedVault.DecryptSecrets(bootstrapSecret).ToArray();
            if (secrets.Length == 0)
            {
                logger.LogWarning(
                    "The persisted vault matching {ConfigurationKey} contains no secrets. The vault remains sealed.",
                    BootstrapSecretConfigurationKey);
                return;
            }

            vault.Unseal(secrets);
            logger.LogInformation(
                "Vault unsealed from {ConfigurationKey} with {SecretCount} secret entries.",
                BootstrapSecretConfigurationKey,
                secrets.Length);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
