import { oc } from "@orpc/contract";
import { SendMailInput, SendMailOutput } from "@/types.ts";

const sendMail = oc
  .route({
    method: "POST",
    path: "/inbox/{id}",
    summary: "Send email with client generated mail id",
    description:
      "Send new Mails to this endpoint either to 'send' or 'relay the mail' to a 'destination`(email address), inferred from 'to' field",
  })
  .input(SendMailInput)
  .output(SendMailOutput);

export default sendMail;
