import { oc } from "@orpc/contract";
import { ErrorValue, MailBody, SuccessValue } from "@/types";
import { type } from "arktype";

/**
 * Get many mails at once
 * - it doesn't verify signatures
 */
const getMails = oc
  .route({
    method: "GET",
    path: "/inbox/mails",
    summary: "Retrieve multiple (many) mails in bulk",
  })
  .input(
    type({
      for: "string.alphanumeric",
      mailIds: "string.alphanumeric[]",
      "markAsUnread?": "boolean",
      "backup?": "boolean",
    })
  )
  .output(SuccessValue(MailBody.array()).or(ErrorValue));

export default getMails;
