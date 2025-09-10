# moh: Mail Over HTTPS

> URI: `mail://user@server.tld`
>
> Inbox (mailbox or email) address : `user@server.tld`

## Manifesto

Emails should be

- **encrypted** (end-to-end asymmetric key encryption, no need to share your mails with google, microsoft or any of your 'mail server as a service provider' so that it can shove better ads down your \*$#),
- **trustless** (trust maths not humans; cryptography over admins or companies)
- **stateless** (Async, Idempotent, signatures, not sessions),
- ruthlessly **minimal** (Tiny surface: 5 endpoints `HTTPS\REST` only. No MIME archaeology. No MX DNS records for static discovery, supports dynamic values natively. no shenanigans, purely functional. So, no backward compatibily or )
- **Human friendly** (email address looks exatly like SMTP, eg, `user@server.tld` & errors as values to handle awkward requests gracefully; `curl` is your email client now.)
- **Secure** by default (Private/Secret is hold by the user. encrypted & signed by the sender; servers hold sealed envelopes, can't read it.)
- **Ephemeral** by default (server stores unread queue only, delete on fetch, unless explicitly 'marked as unread' or requested 'backup'. So, no Infinite Retension like IMAP ).

## Protocol

- Transport: HTTPS
- Encryption: Ed25519

### Endpoints:

#### New Mail (`mail://receiver@server`)

> POST `/inbox/:mailId`

- json schema : `MailBody`
- response schema: `Sent(success | error)`

##### relay mails:

- for `moh`, relay to same endpoint as 'sending new message'

- for legacy (smtp) support :

> POST `/inbox/fallback`

#### List new mails (`mail://me@server`)

> GET `/inbox`

- auth: basic
- response: `string[]` (mail ids)

#### Fetch mail

- query params: (keys only, no need to add boolean values)
  - backup
  - markAsUnread

##### Status

> GET `/inbox/:id/status`

- response: `"sent" | "unread" | "read"`

##### One (Dynamic param)

> GET `/inbox/:id`

- response schema: `MailBody`

##### Many (Special static param)

> GET `/inbox/mails`

- reponse schema: `MailBody[]`

#### Get public key

> GET `/cipher` (or `pubkey`)

#### Set public key

> POST `/cipher` (or `pubkey`)

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
|   **Fetch mail(s)**   | `IMAP: FETCH <id>` (can be multiple round trips)                               | `GET /inbox/:id` or `GET /inbox/all` → JSON payload(s), deletes unless marked unread                      |
|    **Delete mail**    | `IMAP: STORE +FLAGS \Deleted` + `EXPUNGE`                                      | Implicit: fetch auto-deletes (unless `?markAsUnread=true` or `?backup=true`)                              |
| **Public key lookup** | Not built in (PGP/S/MIME external, messy keyservers)                           | `GET /pk` → JSON pubkey (base64, algo metadata)                                                           |
|     **Transport**     | SMTP over TCP, opportunistic TLS, STARTTLS hacks                               | HTTPS/TLS everywhere, modern infra/CDN compatible                                                         |
|       **Auth**        | Server sessions: LOGIN, PLAIN, CRAM-MD5, OAuth2, etc.                          | None — URL username + signature = auth (stateless, verifiable)                                            |
|    **Encryption**     | Optional add-ons (PGP, S/MIME, OTR)                                            | Native: encrypt with receiver pubkey, sign with sender privkey                                            |
|  **Message format**   | RFC 5322 headers, MIME multiparts                                              | Minimal JSON (subject, text, thread, meta)                                                                |
|     **Retention**     | Servers store indefinitely unless purged                                       | Ephemeral by default — only unseen retained, delete on fetch                                              |
|     **Discovery**     | MX records in DNS (extra config layer)                                         | None — client hits `mail://user@server` directly (dynamic/custom values are supported natively)           |
|      **Errors**       | Varied codes, often ambiguous                                                  | Always JSON: `{ "error": "reason", "details": "..." }`                                                    |
|     **Overhead**      | \~40 years of baggage (headers, base64, MIME, TLS retrofits                    | 5 endpoints, stateless, clean AF                                                                          |
