import { ErrorValue, SuccessValue } from "@/types.ts";
import { oc } from "@orpc/contract";
import { type } from "arktype";

/**
 * List the unread mails IDs
 */
const listMails = oc
  .route({
    method: "GET",
    path: "/inbox",
    summary: "Get id's of all unread mails",
  })
  .input(
    type({
      username: "string.alphanumeric",
      type: "'unread'|'new'|'saved' = 'new'",
      signature: "string",
    })
  )
  .output(
    SuccessValue({
      ids: "string[]",
    }).or(ErrorValue)
  );

export default listMails;
