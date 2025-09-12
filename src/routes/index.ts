import setCipher from "./cipher/post.ts";
import getCipher from "./cipher/get.ts";
import sendMail from "./inbox/$id/post.ts";
import sendMailFallback from "./inbox/legacy/post.ts";
import getMailStatus from "./inbox/$id/status/get.ts";
import listMails from "./inbox/get.ts";
import getMail from "./inbox/$id/get.ts";
import getMails from "./inbox/mails/get.ts";

/**
 * The `moh` spec
 * - Mail Over HTTPS
 * - routes (RESTful Endpoints) contract
 * - in RPC standard
 * @property mail 'Sending, Fetching mails related endpoints'
 * @property pubkey 'Fetching & setting/updating cipher endpoint'
 */
const routes = {
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

export { routes as spec };
