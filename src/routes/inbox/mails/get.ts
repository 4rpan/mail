import { GetMailBulkInput, GetMailBulkOutput } from "@/types.ts";
import { oc } from "@orpc/contract";

const getMails = oc
  .route({
    method: "GET",
    path: "/inbox/mails",
    summary: "Retrieve multiple (many) mails in bulk",
  })
  .input(GetMailBulkInput)
  .output(GetMailBulkOutput);

export default getMails;
