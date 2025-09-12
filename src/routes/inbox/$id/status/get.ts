import { oc } from "@orpc/contract";
import { type } from "arktype";
import { SuccessValue, ErrorValue } from "@/types.ts";

/**
 * Check the status of the mail
 */
const getMailStatus = oc
  .route({
    method: "GET",
    path: "/{username}/inbox/{id}/status",
    summary: "Check the status of the mail",
    description:
      "Get an acknowledgement for the server on wheather it is 'sending', already 'sent', wheather 'unread' or 'read' by specific mail id",
  }) 
  .input(
    type({
      id: "string.alphanumeric",
      username: "string.alphanumeric",
    })
  )
  .output(
    SuccessValue({
      status: "'sending'|'sent'|'unread'|'read'",
    }).or(ErrorValue)
  );

export default getMailStatus;
