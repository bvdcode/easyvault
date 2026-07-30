using EasyVault.Server.Database;
using EasyVault.Server.Models;
using EasyVault.Server.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;

namespace EasyVault.Tests
{
    public class BootstrapVaultHostedServiceTests
    {
        private const string BootstrapSecret = "test-bootstrap-secret";

        [Test]
        public async Task StartAsync_ShouldUnsealLatestVault_WhenBootstrapSecretMatches()
        {
            await using SqliteConnection connection = await CreateOpenConnectionAsync();
            await using ServiceProvider serviceProvider = CreateServiceProvider(connection);
            Guid secretId = Guid.NewGuid();
            await SaveVaultAsync(serviceProvider, BootstrapSecret, secretId);
            RecordingVault vault = new();
            IConfiguration configuration = CreateConfiguration(BootstrapSecret);
            BootstrapVaultHostedService hostedService = CreateHostedService(
                serviceProvider,
                configuration,
                vault);

            await hostedService.StartAsync(CancellationToken.None);

            VaultSecret? loadedSecret = vault.GetSecrets(secretId);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(vault.IsSealed, Is.False);
                Assert.That(loadedSecret, Is.Not.Null);
                Assert.That(loadedSecret!.Values["token"], Is.EqualTo("value"));
            }
        }

        [Test]
        public async Task StartAsync_ShouldRemainSealed_WhenBootstrapSecretDoesNotMatch()
        {
            await using SqliteConnection connection = await CreateOpenConnectionAsync();
            await using ServiceProvider serviceProvider = CreateServiceProvider(connection);
            await SaveVaultAsync(serviceProvider, BootstrapSecret, Guid.NewGuid());
            RecordingVault vault = new();
            IConfiguration configuration = CreateConfiguration("different-secret");
            BootstrapVaultHostedService hostedService = CreateHostedService(
                serviceProvider,
                configuration,
                vault);

            await hostedService.StartAsync(CancellationToken.None);

            Assert.That(vault.IsSealed, Is.True);
        }

        [Test]
        public async Task StartAsync_ShouldRemainSealed_WhenBootstrapSecretIsNotConfigured()
        {
            await using SqliteConnection connection = await CreateOpenConnectionAsync();
            await using ServiceProvider serviceProvider = CreateServiceProvider(connection);
            RecordingVault vault = new();
            IConfiguration configuration = CreateConfiguration(null);
            BootstrapVaultHostedService hostedService = CreateHostedService(
                serviceProvider,
                configuration,
                vault);

            await hostedService.StartAsync(CancellationToken.None);

            Assert.That(vault.IsSealed, Is.True);
        }

        private static BootstrapVaultHostedService CreateHostedService(
            ServiceProvider serviceProvider,
            IConfiguration configuration,
            IVault vault)
        {
            IServiceScopeFactory scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            return new BootstrapVaultHostedService(
                configuration,
                scopeFactory,
                vault,
                NullLogger<BootstrapVaultHostedService>.Instance);
        }

        private static IConfiguration CreateConfiguration(string? bootstrapSecret)
        {
            Dictionary<string, string?> values = [];
            if (bootstrapSecret is not null)
            {
                values["BOOTSTRAP_SECRET"] = bootstrapSecret;
            }

            return new ConfigurationBuilder()
                .AddInMemoryCollection(values)
                .Build();
        }

        private static async Task<SqliteConnection> CreateOpenConnectionAsync()
        {
            SqliteConnection connection = new("Data Source=:memory:");
            await connection.OpenAsync();
            return connection;
        }

        private static ServiceProvider CreateServiceProvider(SqliteConnection connection)
        {
            ServiceCollection services = new();
            services.AddSingleton(connection);
            services.AddDbContext<AppDbContext>((serviceProvider, options) =>
                options.UseSqlite(serviceProvider.GetRequiredService<SqliteConnection>()));
            return services.BuildServiceProvider();
        }

        private static async Task SaveVaultAsync(
            ServiceProvider serviceProvider,
            string encryptionKey,
            Guid secretId)
        {
            await using AsyncServiceScope scope = serviceProvider.CreateAsyncScope();
            AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.Database.EnsureCreatedAsync();
            Vault storedVault = new()
            {
                CreatedFromIpAddress = "127.0.0.1",
                CreatedFromUserAgent = "Tests"
            };
            storedVault.EncryptSecrets(
                encryptionKey,
                [
                    new VaultSecret
                    {
                        KeyId = secretId,
                        AppName = "Test application",
                        Values = new Dictionary<string, string>
                        {
                            ["token"] = "value"
                        }
                    }
                ]);
            dbContext.Vaults.Add(storedVault);
            await dbContext.SaveChangesAsync();
        }
    }
}
