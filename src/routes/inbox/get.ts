import { ListMailInput, ListMailOutput } from "@/types.ts";
import { oc } from "@orpc/contract";

const listMails = oc
  .route({
    method: "GET",
    path: "/inbox",
    summary: "Get id's of all unread mails",
  })
  .input(ListMailInput)
  .output(ListMailOutput);

export default listMails;
