using System.Text;
using EasyVault.Server.Models;
using Microsoft.AspNetCore.Mvc;
using EasyExtensions.Extensions;
using EasyVault.Server.Database;
using EasyVault.Server.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using EasyExtensions.AspNetCore.Extensions;
using System.ComponentModel.DataAnnotations;

namespace EasyVault.Server.Controllers
{
    [ApiController]
    public class VaultController(ILogger<VaultController> _logger, AppDbContext _dbContext, IVault _vault) : ControllerBase
    {
        [HttpGet("/api/v1/vault/{key}")]
        [HttpGet("/api/v2/vault/{key}")]
        public async Task<IEnumerable<VaultSecret>> GetVaultAsync([FromRoute][Required] string key)
        {
            string ip = Request.GetRemoteAddress();
            string userAgent = Request.Headers.UserAgent.ToString() ?? "unknown";
            AccessEvent accessEvent = new()
            {
                IpAddress = ip,
                Route = Request.Path.ToString().Replace(key, new string('*', key.Length)),
                UserAgent = userAgent,
                Method = nameof(GetVaultAsync)
            };
            await _dbContext.AccessEvents.AddAsync(accessEvent);
            await _dbContext.SaveChangesAsync();
            if (string.IsNullOrWhiteSpace(key))
            {
                return [];
            }
            string keyHash = key.Sha512();
            var foundVault = await _dbContext.Vaults
                .OrderByDescending(v => v.CreatedAt)
                .FirstOrDefaultAsync(v => v.SecretKeyHashSha512 == keyHash);
            if (foundVault == null)
            {
                return [];
            }
            var result = foundVault.DecryptSecrets(key);
            _vault.Unseal(result);
            return result;
        }

        [HttpPost("/api/v1/vault/{key}")]
        [HttpPost("/api/v2/vault/{key}")]
        public async Task<IActionResult> UpdateVaultAsync([FromRoute][Required] string key, [FromBody] IEnumerable<VaultSecret> secrets)
        {
            string ip = Request.GetRemoteAddress();
            string userAgent = Request.Headers.UserAgent.ToString() ?? "unknown";
            AccessEvent accessEvent = new()
            {
                IpAddress = ip,
                Route = Request.Path.ToString().Replace(key, new string('*', key.Length), StringComparison.InvariantCultureIgnoreCase),
                UserAgent = userAgent,
                Method = nameof(UpdateVaultAsync)
            };
            await _dbContext.AccessEvents.AddAsync(accessEvent);
            await _dbContext.SaveChangesAsync();
            if (string.IsNullOrWhiteSpace(key))
            {
                return BadRequest("Key cannot be null or empty.");
            }
            if (secrets == null || !secrets.Any())
            {
                return BadRequest("Secrets cannot be null or empty.");
            }
            foreach (var secret in secrets)
            {
                if (string.IsNullOrWhiteSpace(secret.AppName))
                {
                    return BadRequest("AppName cannot be null or empty.");
                }
                if (secret.KeyId == Guid.Empty)
                {
                    return BadRequest("KeyId cannot be empty.");
                }
                if (secret.Values == null || secret.Values.Count == 0)
                {
                    return BadRequest("Values cannot be null or empty.");
                }
            }
            Vault foundVault = new()
            {
                CreatedFromIpAddress = ip,
                CreatedFromUserAgent = userAgent,
            };
            _dbContext.Vaults.Add(foundVault);
            foundVault.EncryptSecrets(key, secrets);
            await _dbContext.SaveChangesAsync();
            _vault.Unseal(secrets);
            return Ok("Vault updated successfully.");
        }

        [HttpGet("/api/v1/vault/secrets/{keyId}")]
        [HttpGet("/api/v2/vault/secrets/{keyId}")]
        public async Task<IActionResult> GetSecret(Guid keyId, [FromQuery] string format = "json")
        {
            string ip = Request.GetRemoteAddress();
            string userAgent = Request.Headers.UserAgent.ToString() ?? "unknown";
            AccessEvent accessEvent = new()
            {
                IpAddress = ip,
                Route = Request.Path.ToString().Replace(keyId.ToString(), new string('*', keyId.ToString().Length)),
                UserAgent = userAgent,
                Method = nameof(UpdateVaultAsync)
            };
            await _dbContext.AccessEvents.AddAsync(accessEvent);
            await _dbContext.SaveChangesAsync();
            if (_vault.IsSealed)
            {
                return Unauthorized("Vault is sealed. Unseal it first.");
            }
            VaultSecret result = _vault.GetSecrets(keyId);
            if (result == null || !IsAllowed(result, ip, userAgent))
            {
                _logger.LogWarning("Unauthorized access attempt from {remoteAddress} with user agent {userAgent}",
                    ip, userAgent);
                return Unauthorized();
            }
            _logger.LogInformation("Access granted from {remoteAddress} for {count} values with user agent {userAgent}", 
                ip, result.Values.Count, userAgent);
            if (format == "json")
            {
                return Ok(result.Values);
            }
            else if (format == "plain")
            {
                var sb = new StringBuilder();
                foreach (var kvp in result.Values)
                {
                    sb.AppendLine($"{kvp.Key}={kvp.Value}");
                }
                return Content(sb.ToString().Trim(), "text/plain");
            }
            else
            {
                return BadRequest("Invalid format specified. Use 'json' or 'plain'.");
            }
        }

        private static bool IsAllowed(VaultSecret found, string remoteAddress, string userAgent)
        {
            bool allowedByIp = found.AllowedAddresses.Length == 0 ||
                found.AllowedAddresses.Any(pattern =>
                    pattern.Contains('*')
                        ? IsWildcardMatch(pattern, remoteAddress)
                        : pattern == remoteAddress);

            bool allowedByUserAgent = found.AllowedUserAgents.Length == 0 ||
                found.AllowedUserAgents.Any(pattern =>
                    pattern.Contains('*')
                        ? IsWildcardMatch(pattern, userAgent)
                        : pattern == userAgent);

            return allowedByIp && allowedByUserAgent;
        }

        private static bool IsWildcardMatch(string pattern, string input)
        {
            string regexPattern = "^" + Regex.Escape(pattern).Replace("\\*", ".*") + "$";
            return Regex.IsMatch(input, regexPattern);
        }
    }
}