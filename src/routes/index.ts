import setCipher from "./cipher/post";
import getCipher from "./cipher/get";

import sendMail from "./inbox/$id/post";
import getMailStatus from "./inbox/$id/status/get";
import listMails from "./inbox/get";
import getMail from "./inbox/$id/get";
import sendMailFallback from "./inbox/legacy/post";
import getMails from "./inbox/mails/get";

/**
 * The `moh` spec
 * - Mail Over HTTPS
 * - routes (RESTful Endpoints) contract
 * - in RPC standard
 * @field mail 'Sending, Fetching mails related endpoints'
 * @field pubkey 'Fetching & setting/updating cipher endpoint'
 *
 * @example
 * ```ts
 * import { spec } from "@arpan/mail"
 *
 * // server
 * const server = implementServer(spec)
 *
 * // client
 * const client = createClient(spec)
 * ```
 * @module
 */
export const routes = {
  /**
   * Mail related procedures
   */
  mail: {
    /**
     * Create new mail
     */
    send: sendMail,
    /**
     * Legacy (SMTP) fallback, for sending emails (if 'to' moh endpoint isn't valid)
     */
    sendLegacy: sendMailFallback,
    /**
     * List new/unread/saved mails
     */
    list: listMails,
    /**
     * Get mail or mails or status by id
     */
    fetch: {
      one: getMail,
      many: getMails,
      status: getMailStatus,
    },
  },
  /**
   * Encryption & signature varification key
   */
  pubkey: {
    get: getCipher,
    set: setCipher,
  },
};
