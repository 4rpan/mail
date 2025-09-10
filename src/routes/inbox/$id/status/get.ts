import { oc } from "@orpc/contract";
import { GetMailStatusInput, GetMailStatusOutput } from "@/types.ts";

const getMailStatus = oc
  .route({
    method: "GET",
    path: "/{username}/inbox/{id}/status",
    summary: "Check wheather mail is recieved successfully",
    description:
      "Get an acknowledgement for a specific mail with it's id on wheather it is accepted by the server or reciver",
  })
  .input(GetMailStatusInput)
  .output(GetMailStatusOutput);

export default getMailStatus;
