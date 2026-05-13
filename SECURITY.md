# Security Policy

## Reporting a vulnerability

If you have found a security vulnerability in Nasij, **do not open a public issue**.

Instead, email <hmdy7486@gmail.com> with:

- A description of the vulnerability and its impact.
- Steps to reproduce.
- Affected versions / commit SHA.
- Any suggested mitigation.

You will receive an acknowledgement within 72 hours. Once the issue is triaged you will be kept informed of progress toward a fix and a disclosure timeline (typically ≤ 90 days from the original report).

## Supported versions

This project tracks the `main` branch in production. Only `main` is supported for security fixes.

## Hardening baseline

- All dependencies scanned via `pnpm audit` and Dependabot.
- CodeQL static analysis runs on every PR.
- Secret scanning is enabled at the repository level.
- All HTTP endpoints enforce TLS in production.
- Sessions are HTTP-only, `Secure`, `SameSite=Lax`; rotation on privilege change.
- CSRF protection via double-submit cookie pattern for state-changing requests.
- Passwords hashed with argon2id; minimum policy enforced at sign-up.
- TOTP 2FA required for admin and manager roles; PIN auth on POS devices is paired with device fingerprinting.
- All admin actions are written to an immutable audit log.
- Personal data export and deletion endpoints exist (GDPR / Egypt PDPL).
