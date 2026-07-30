import { z } from "zod";

export const VaultDataSchema = z.object({
  keyId: z.string(),
  appName: z.string(),
  values: z.record(z.string(), z.string()),
  allowedAddresses: z.array(z.string()),
  allowedUserAgents: z.array(z.string()),
});
