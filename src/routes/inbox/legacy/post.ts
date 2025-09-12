import { oc } from "@orpc/contract";
import {
  ErrorValue,
  MailBody,
  SuccessValue,
} from "@/types.ts";

/**
 * Forward mails to legacy (SMTP) server
 */
const sendMailFallback = oc
  .route({
    method: "POST",
    path: "/inbox/{id}",
    summary: "Send email to 'smtp' address with client generated mail id",
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

export default sendMailFallback;
