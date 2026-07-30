import { VaultData } from "../types";

export const filterVaultData = (
  vaultData: VaultData[],
  searchQuery: string,
): VaultData[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) {
    return vaultData;
  }

  return vaultData.filter((entry) => {
    const searchableValues = [
      entry.appName,
      ...Object.keys(entry.values),
      ...Object.values(entry.values),
    ];

    return searchableValues.some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });
};
