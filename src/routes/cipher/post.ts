import { oc } from "@orpc/contract";
import { type } from "arktype";
import { ErrorValue, SuccessValue } from "@/types";

/**
 * Set new public key for this server
 */
const setCipher = oc
  .route({
    method: "POST",
    path: "/cipher",
    summary: "Set new public key for your inbox",
    tags: ["encryption"],
    description:
      "Set the encryption or signature validation cipher/key. It should require additional authentication steps depending upon the provider. If 2fa is not completed before `ttl`, new public key won't be set",
  })
  .input(
    type({
      pubkey: "string.hex == 64",
      ttl: "number.epoch",
    })
  )
  .output(
    SuccessValue({
      cipher: "string.hex == 64",
    }).or(ErrorValue)
  );

export default setCipher;
