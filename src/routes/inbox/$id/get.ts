import { oc } from "@orpc/contract";
import { type } from "arktype";
import { SuccessValue, ErrorValue, MailBody } from "@/types";

/**
 * Retrieve a mail by it's id
 * - a primary endpoint.
 */
const getMail = oc
  .route({
    method: "GET",
    path: "/inbox/{id}",
    summary: "Get the mail body",
  })
  .input(
    type({
      mailId: "string.alphanumeric",
      for: "string.alphanumeric",
      "markAsUnread?": "boolean",
      "backup?": "boolean",
    })
  )
  .output(
    SuccessValue({
      mail: MailBody,
      "isSignatureVarified?": "boolean",
    }).or(ErrorValue)
  );

export default getMail;
