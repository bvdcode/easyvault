import { describe, expect, it } from "vitest";
import { VaultDataSchema } from "./VaultDataSchema";

describe("VaultDataSchema", () => {
  it("accepts valid vault data", () => {
    const result = VaultDataSchema.safeParse({
      keyId: "f85bc18c-8dfb-4972-8eda-90e3f66cbb95",
      appName: "Example",
      values: {
        apiKey: "secret",
      },
      allowedAddresses: [],
      allowedUserAgents: [],
    });

    expect(result.success).toBe(true);
  });

  it("rejects non-string secret values", () => {
    const result = VaultDataSchema.safeParse({
      keyId: "f85bc18c-8dfb-4972-8eda-90e3f66cbb95",
      appName: "Example",
      values: {
        apiKey: 123,
      },
      allowedAddresses: [],
      allowedUserAgents: [],
    });

    expect(result.success).toBe(false);
  });
});
