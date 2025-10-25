# Security Policy

We take security seriously for **fullstack-singer-platform**.

## Supported Versions

| Version | Supported |
| ------: | :-------- |
|    main | ✅        |
|  others | ❌        |

## Reporting a Vulnerability

If you discover a security issue:

1. Open a public issue and provide.
   - A detailed description of the vulnerability
   - Steps to reproduce and potential impact
   - Suggested mitigation (if any)
2. Alternatively, use **GitHub Security Advisories** (Private) for coordinated disclosure.

We aim to acknowledge reports within **72 hours** and provide a remediation timeline after triage.

## Scope (Examples)

In scope:

- Auth bypasses, privilege escalation
- Injection (SQL/NoSQL), XSS, CSRF, SSRF
- Authentication/session issues, insecure TLS usage
- Data exposure through misconfigurations

Out of scope:

- Clickjacking on pages without sensitive actions
- Rate-limit or brute-force findings without evidence of impact
- Vulnerabilities requiring root/physical access or non-supported browsers
- Dependency issues without a workable PoC

## Safe Harbor

We will not pursue legal action for **good-faith** research that:

- Respects privacy and does not exfiltrate data
- Avoids service degradation
- Gives us reasonable time to remediate before public disclosure
