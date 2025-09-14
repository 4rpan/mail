import { oc } from "@orpc/contract";
import { ErrorValue, SuccessValue, MailBody } from "@/types";

/**
 * This endpoint recieves mails from clients or other servers
 * - a primary endpoint
 */
const sendMail = oc
  .route({
    method: "POST",
    path: "/inbox/{id}",
    summary: "Send email with client generated mail id",
    description:
      "Send new Mails to this endpoint either to 'send' or 'relay the mail' to a 'destination`(email address), inferred from 'to' field",
  })
  .input(MailBody)
  .output(
    SuccessValue({
      id: "string",
      to: "string.alphanumeric",
    }).or(ErrorValue)
  );

export default sendMail;
