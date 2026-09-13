# Admin demo authentication boundary

`/admin/login` is deliberately an insecure, client-only presentation gate. Its
visible demo credential and `sessionStorage` flag do not protect data or routes.

For production, replace `src/lib/admin-demo-auth.ts` and the guard in
`AdminShell` with:

- server-validated identity and role authorization;
- an `HttpOnly`, `Secure`, `SameSite` session cookie;
- authorization checks on every server/API mutation;
- rate limiting, audit logging, CSRF protection and session expiry.

The client must never receive provider credentials. Publishing must be performed
by the future server/n8n adapter, not by `DemoPublishingProvider`.
