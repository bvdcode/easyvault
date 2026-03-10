using System;
using System.Net.Http;
using System.Collections.Generic;

namespace EasyVault.SDK
{
    /// <summary>
    /// EasyVaultClient is a client to access the EasyVault API.
    /// </summary>
    public class EasyVaultClient : IEasyVaultClient
    {
        private readonly Guid _apiKey;
        private readonly HttpClient _httpClient = new HttpClient();

        /// <summary>
        /// Initializes a new instance of the EasyVaultClient class with the specified base URL.
        /// </summary>
        public EasyVaultClient(string baseUrl, Guid apiKey)
        {
            if (apiKey == Guid.Empty)
            {
                throw new ArgumentException("API key is required.", nameof(apiKey));
            }
            _apiKey = apiKey;
            _httpClient.BaseAddress = new Uri(baseUrl);
            string currentAssembly = System.Reflection.Assembly.GetEntryAssembly().GetName().Name;
            _httpClient.DefaultRequestHeaders.Add("User-Agent", currentAssembly);
        }

        /// <summary>
        /// Gets the secrets dictionary for the specified API key.
        /// </summary>
        /// <returns>Dictionary of secrets.</returns>
        public Dictionary<string, string> GetSecrets()
        {
            const string url = "/api/v1/vault/secrets/{0}";
            var response = _httpClient.GetAsync(string.Format(url, _apiKey)).Result;
            if (response.IsSuccessStatusCode)
            {
                return Parse(response.Content.ReadAsStringAsync().Result);
            }
            else
            {
                throw new HttpRequestException("Failed to retrieve secrets from " +
                    _httpClient.BaseAddress + ". Status code: " + response.StatusCode);
            }
        }

        /// <summary>
        /// Gets the secrets object for the specified API key.
        /// </summary>
        /// <typeparam name="T">Type of the secrets object.</typeparam>
        /// <returns>Secrets object.</returns>
        public T GetSecrets<T>()
        {
            var secrets = GetSecrets();
            object result = Activator.CreateInstance(typeof(T));
            foreach (var prop in typeof(T).GetProperties())
            {
                foreach (var key in secrets.Keys)
                {
                    if (key.Equals(prop.Name, StringComparison.OrdinalIgnoreCase))
                    {
                        prop.SetValue(result, secrets[key]);
                    }
                }
            }
            return (T)result;
        }

        private Dictionary<string, string> Parse(string result)
        {
            return System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(result)
                ?? throw new InvalidOperationException("Failed to parse secrets.");
        }
    }
}