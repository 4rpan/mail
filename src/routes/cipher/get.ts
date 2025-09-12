import { oc } from "@orpc/contract";
import { type } from "arktype";
import { ErrorValue, SuccessValue } from "@/types.ts";

/**
 * Retrieve public key of the user
 */
const getCipher = oc
  .route({
    method: "GET",
    path: "/cipher",
    summary: "Get the public key of the user",
    tags: ["encryption"],
    description: "Get the encryption or signature validation cipher/key.",
  })
  .input(
    type({
      of: "string.alphanumeric",
    })
  )
  .output(
    SuccessValue({
      pubkey: "string",
    }).or(ErrorValue)
  );

export default getCipher;
