using System.Text.Json;
using EasyVault.Server.Models;
using EasyExtensions.Extensions;
using System.Security.Cryptography;
using System.ComponentModel.DataAnnotations.Schema;
using EasyExtensions.EntityFrameworkCore.Abstractions;

namespace EasyVault.Server.Database
{
    [Table("vaults")]
    public class Vault : BaseEntity<Guid>
    {
        [Column("secret_key_hash_sha512")]
        public string SecretKeyHashSha512 { get; set; } = string.Empty;

        [Column("hash_algorithm")]
        public string HashAlgorithm { get; set; } = string.Empty;

        [Column("encrypted_data")]
        public string EncryptedData { get; set; } = string.Empty;

        [Column("salt")]
        public byte[] Salt { get; set; } = [];

        [Column("created_from_ip_address")]
        public string CreatedFromIpAddress { get; set; } = string.Empty;

        [Column("created_from_user_agent")]
        public string CreatedFromUserAgent { get; set; } = string.Empty;

        public IEnumerable<VaultSecret> DecryptSecrets(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));
            }
            if (SecretKeyHashSha512 != key.Sha512())
            {
                throw new UnauthorizedAccessException("Invalid decryption key provided.");
            }
            if (string.IsNullOrEmpty(EncryptedData))
            {
                return [];
            }

            byte[] keyBytes = DeriveKeyFromPassword(key);
            string decryptedJson = DecryptStringAes(EncryptedData, keyBytes);
            return JsonSerializer.Deserialize<List<VaultSecret>>(decryptedJson) ?? Enumerable.Empty<VaultSecret>();
        }


        public void EncryptSecrets(string key, IEnumerable<VaultSecret> secrets)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));
            }

            if (secrets == null || !secrets.Any())
            {
                throw new ArgumentException("Secrets cannot be null or empty.", nameof(secrets));
            }

            SecretKeyHashSha512 = key.Sha512();
            string secretsJson = JsonSerializer.Serialize(secrets);
            byte[] keyBytes = DeriveKeyFromPassword(key);
            EncryptedData = EncryptStringAes(secretsJson, keyBytes);
            HashAlgorithm = HashAlgorithmName.SHA256.Name
                ?? throw new InvalidOperationException("Hash algorithm name not found.");
        }

        private byte[] DeriveKeyFromPassword(string password)
        {
            if (Salt.Length == 0)
            {
                using var rng = RandomNumberGenerator.Create();
                Salt = new byte[16]; // 128 bits salt
                rng.GetBytes(Salt);
            }
            return Rfc2898DeriveBytes.Pbkdf2(password, Salt, 10000, HashAlgorithmName.SHA256, 32); // 256 bits key for AES-256
        }

        private static string EncryptStringAes(string plainText, byte[] key)
        {
            using var aes = Aes.Create();
            aes.Key = key;
            aes.GenerateIV(); // Generate a new IV for each encryption
            using var encryptor = aes.CreateEncryptor();
            using var msEncrypt = new MemoryStream();
            msEncrypt.Write(aes.IV, 0, aes.IV.Length);
            using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
            {
                using var swEncrypt = new StreamWriter(csEncrypt);
                swEncrypt.Write(plainText);
            }
            return Convert.ToBase64String(msEncrypt.ToArray());
        }

        private static string DecryptStringAes(string cipherText, byte[] key)
        {
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using var aes = Aes.Create();
            aes.Key = key;
            // Get the IV from the cipher text (first 16 bytes for AES)
            byte[] iv = new byte[16]; // AES block size is 16 bytes
            Array.Copy(cipherBytes, 0, iv, 0, iv.Length);
            aes.IV = iv;
            using var decryptor = aes.CreateDecryptor();
            using var msDecrypt = new MemoryStream(cipherBytes, iv.Length, cipherBytes.Length - iv.Length);
            using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
            using var srDecrypt = new StreamReader(csDecrypt);
            return srDecrypt.ReadToEnd();
        }
    }
}
