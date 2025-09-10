import { oc } from "@orpc/contract";
import { GetMailInput, GetMailOutput } from "@/types.ts";

const getMail = oc
  .route({
    method: "GET",
    path: "/inbox/{id}",
    summary: "Get the mail body",
  })
  .input(GetMailInput)
  .output(GetMailOutput);

export default getMail;
