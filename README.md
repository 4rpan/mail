# moh: Mail Over HTTPS

> URI: `mail://user@server.tld`
>
> Inbox (mailbox or email address) : `user@server.tld`

## Manifesto

Emails should be

- **Secure** by default : Mails should be encrypted & signed by the sender; servers hold only the sealed envelopes, can't read it, only relay it to the destination. Reciever verifies signature & decrypt the mail to read.
- **trustless** architecture : Trust only yourself & maths not other humans or companies; cryptography over admins. No need to allow companies (meta,apple,etc.) to store our decryption keys for "our convenience".
- Truly end-to-end **encrypted** : asymmetric key encryption & secret (private key) is held by the user (not server). No need to share your mails with corporatins (google, microsoft,yahoo,zoho, etc.) so that it can shove better ads down your throat later.
- **stateless** : Async & Idempotent. signatures over sessions.
- **Human friendly** : email address should look exatly like SMTP addresses, eg, `user@server.tld` & errors as values to handle awkward situation gracefully; `curl` is your email client now.
- **Ephemeral** by default : Server stores unread queues only, deletes the mail when reciever has recieved it, unless explicitly 'marked as unread' or requested to 'backup'. So, no Infinite Retension like IMAP.
- Easy to **Self Host** : It should be RESTful HTTPS endpoints with JSON payloads. Basically host it for free (almost) with any cloud providers or On-prem.
- ruthlessly **minimal** : Tiny surface (8 endpoints) yet powerful enough to replace SMTP+IMAP. No MIME archaeology. No MX DNS records.no shenanigans, purely functional bare bones.

## Protocol

- Transport: HTTPS
- Encryption: Ed25519 

Future: post quantum crpto support (in moh v2).

### Endpoints:

#### Send Mail (`mail://receiver@server`)

> **POST** `/inbox/:mailId`

- `mailId`: alphanumeric text (string)
- json schema : `MailBody`

##### relay mails:

- for `moh`

  - send your mail to any moh server at this endpoint
  - it'll relay to correct mail server (on the basis of 'to' field)
  - if `moh` server is unavailable (or if signature is not provided), it'll try to forward to the smtp server.

- for legacy (smtp) forwarding specifically :

> **POST** `/inbox/legacy`

#### List new mails (`mail://me@server`)

> **GET** `/inbox`

- response: `string[]` (mail ids)

#### Fetch mail

> **GET** `/inbox/:mailId`

- get mail & delete from server.
- extra params:
  - backup
  - markAsUnread

##### Status

> **GET** `/inbox/:id/status`

- response: `"sending" | "sent" | "unread" | "read"`

##### One 

> **GET** `/inbox/:mailId`

- mail id as path param
- response schema: `MailBody`

##### Many

> GET `/inbox/mails`

- json schema: 'mailIds', 'for' & extra options for retension.
- reponse schema: `MailBody[]`

#### Get public key

> GET `/cipher`

#### Set public key

> POST `/cipher`

- with additional steps for multi factor authentication implemented by the server.

### Schema

#### **Mail** data type:

```ts
type MailBody = {
  from: string;
  at: number;
  to?: string;
  subject: string;
  ref?: string;
  signature?: string;
  content: string;
  metadata?: Record<string, any>;
};
```

### Comparison

|   Feature / Action    | SMTP + IMAP/POP (traditional)                                                  | MOH (`mail://`)                                                                                           |
| :-------------------: | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
|     **Send mail**     | `SMTP: MAIL FROM`, `RCPT TO`, `DATA` (multiple commands, STARTTLS, MIME bloat) | `POST /` → `mail://receiver@server.tld` or `POST https://server.tld/` w/ `Basic {user:signature}#RFC7617` |
| **List unseen mails** | `IMAP: SEARCH UNSEEN` or `UID SEARCH`                                          | `GET /inbox` → JSON list of unseen mail IDs + subjects                                                    |
|   **Fetch mail(s)**   | `IMAP: FETCH <id>` (can be multiple round trips)                               | `GET /inbox/:id` or `GET /inbox/mails` → JSON payload(s), deletes unless marked unread                    |
|    **Delete mail**    | `IMAP: STORE +FLAGS \Deleted` + `EXPUNGE`                                      | Implicit: fetch auto-deletes (unless `?markAsUnread=true` or `?backup=true`)                              |
| **Public key lookup** | Not built in (PGP/S/MIME external, messy keyservers)                           | `GET /cipher` → JSON pubkey (base64, algo metadata)                                                       |
|     **Transport**     | SMTP over TCP, opportunistic TLS, STARTTLS hacks                               | HTTPS/TLS everywhere, modern infra/CDN compatible                                                         |
|       **Auth**        | Server sessions: LOGIN, PLAIN, CRAM-MD5, OAuth2, etc.                          | None — username + cryptographic signature (stateless, verifiable)                                         |
|    **Encryption**     | Optional add-ons (PGP, S/MIME, OTR)                                            | Native: encrypt with receiver pubkey, sign with sender privkey                                            |
|  **Message format**   | RFC 5322 headers, MIME multiparts                                              | Minimal JSON (subject, body,...)                                                                          |
|     **Retention**     | Servers store indefinitely unless purged                                       | Ephemeral by default — only unseen retained, delete on fetch                                              |
|     **Discovery**     | MX records in DNS (extra config layer)                                         | None — client hits `mail://user@server` directly (dynamic/custom values are supported natively)           |
|      **Errors**       | Varied codes, often ambiguous                                                  | Always JSON: `{ "success": false, "errors": ["reasons"], "message": "details..." }`                       |
|     **Overhead**      | \~40 years of baggage (headers, base64, MIME, TLS retrofits & whatnot)         | 8 endpoints only, stateless, clean AF                                                                     |

## Implementation

### Server

Implement the 'spec' in a typesafe manner with 'orpc'.

- All input/output is fully typesafe & properly documented
- Bring your own 'Database' & write your logic

```ts
import { spec } from "@arpan/mail";
import { implement, call } from "@orpc/server";
import { RPCHandler } from '@orpc/server/fetch'

// Step 1: Implement the routes

// create a blank mail server router instance & set middlewares
const m = implement(spec) .use(xyxMiddlewares);

// implementing procedures
export const fetchMail = m.mail.fetch.one.handler( ({ input }) => {
  // Your logic for fetching mail from server
  return {
    mail: MailBody,
    isSignatureVarified: true,
  };
});
// implement all procedures like this (ideally on separate files to keep things organised)
// use/call one procedures in the app
function verifySignature(sign:string, message:string) {
  const cipher = await call(getCipher, { of : 'username' })
  return verify(cipher, sign, message)
}


// Step 2: Assemble implemented routes

// define the `mail router`
const router = m.router({
  mail: {
    fetch: {
      one: fetchMail
    }
    send: sendOrRelayMail,
    // ...
  },
  cipher: {
    get: getCipher,
    set: setCipher,
  }
})

// Step 3: Implement Server
const handler = new RPCHandler(router)
// fetch compatible server
async function fetch(request: Request): Promise<Response> {
    const { matched, response } = await handler.handle(request)

    if (matched) {
      return response
    }

    return new Response('Not Implemented', { status: 404 })
  }
// export the server or do whatever your 'runtime' require.
export default server
```

### Client

Like the server, RPC Client is also typesafe & ready with minimal effort.

```ts
import type { spec } from "@arpan/mail";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import type { ContractRouterClient } from "@orpc/contract";

// Step 1: Declare the link 
// to call your procedures remotely as if they were local functions.
const link = new RPCLink({ url: 'https://mail.server.tld' })

// Step 2: Generate Client
const client: ContractRouterClient<typeof spec> = createORPCClient(link)

```
