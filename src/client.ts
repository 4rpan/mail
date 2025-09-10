import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import type { routes } from "./routes/index.ts";

export function createMailClient(
  endpoint: string
): ContractRouterClient<typeof routes> {
  const link = new RPCLink({
    url: endpoint,
  });

  return createORPCClient(link);
}
