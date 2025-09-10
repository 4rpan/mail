import { oc } from "@orpc/contract";
import { SetCipherInput, SetCipherOutput } from "@/types.ts";

const setCipher = oc
  .route({
    method: "POST",
    path: "/cipher",
    summary: "Set new public key for your inbox",
    tags: ["encryption"],
    description:
      "Set the encryption or signature validation cipher/key. It should require additional authentication steps depending upon the provider. If 2fa is not completed before `ttl`, new public key won't be set",
  })
  .input(SetCipherInput)
  .output(SetCipherOutput);

export default setCipher;
