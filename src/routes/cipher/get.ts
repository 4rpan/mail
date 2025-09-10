import { oc } from "@orpc/contract";
import { GetCipherInput, GetCipherOutput } from "@/types.ts";

const getCipher = oc
  .route({
    method: "GET",
    path: "/cipher",
    summary: "Get the public key of the user",
    tags: ["encryption"],
    description: "Get the encryption or signature validation cipher/key.",
  })
  .input(GetCipherInput)
  .output(GetCipherOutput);

export default getCipher;
