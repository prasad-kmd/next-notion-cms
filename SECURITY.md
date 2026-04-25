# Security Policy

## Supported Versions

Currently, the following versions of the PrasadM Engineering Blogfolio are supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it privately.

**How to report:**
Please send an email to the project maintainer via the [Contact Page](https://prasadm.vercel.app/contact) or open a private security advisory on GitHub if applicable.

**What to expect:**

- **Response time**: You can expect a response within 48 hours.
- **Updates**: We will provide periodic updates until the vulnerability is resolved.
- **Disclosure**: Vulnerabilities will be publicly disclosed only after a patch is available and sufficient time has passed for users to update.

## Automated Protections

To maintain the security and integrity of the platform, the following automated systems are in place:

- **Spam Protection**: We use Cloudflare Turnstile for bot detection on all public forms (Contact and Comments).
- **Disposable Email Blocking**: The contact form uses the `fakeout` package to detect and block temporary/disposable email addresses.
- **Profanity Filtering**: All user-submitted text (Contact and Comments) is filtered using the `obscenity` package to maintain a professional environment.
- **Rate Limiting**: Both the Contact Form and Comments API are rate-limited per user/identifier to prevent abuse.

Thank you for helping keep this project secure!
