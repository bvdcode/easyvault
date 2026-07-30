import { describe, expect, it } from "vitest";
import { VaultData } from "../types";
import { filterVaultData } from "./filterVaultData";

const vaultData: VaultData[] = [
  {
    keyId: "first",
    appName: "Database",
    values: {
      POSTGRES_PASSWORD: "database-secret",
    },
    allowedAddresses: [],
    allowedUserAgents: [],
  },
  {
    keyId: "second",
    appName: "Payments",
    values: {
      STRIPE_API_KEY: "payment-secret",
    },
    allowedAddresses: [],
    allowedUserAgents: [],
  },
];

describe("filterVaultData", () => {
  it("matches application names", () => {
    expect(filterVaultData(vaultData, "payments")).toEqual([vaultData[1]]);
  });

  it("matches secret keys", () => {
    expect(filterVaultData(vaultData, "postgres")).toEqual([vaultData[0]]);
  });

  it("matches secret values case-insensitively", () => {
    expect(filterVaultData(vaultData, "DATABASE-SECRET")).toEqual([
      vaultData[0],
    ]);
  });

  it("returns every entry for an empty query", () => {
    expect(filterVaultData(vaultData, "  ")).toEqual(vaultData);
  });
});
