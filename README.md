# Security Architecture Guidelines & Best Practices

A structured reference library of security architecture documents, slide decks, and implementation guidance covering Identity & Access Management, Kubernetes security, and AI/LLM security design patterns.

All documents are authored by **Eran Shpigelman** and are intended for security architects, security engineers, and technical leadership.

---

## Repository Structure

```
Security-Architecture-Guidelines-Best-Practices/
│
├── IAM/                            Identity & Access Management
│   ├── SSO/                        Authentication, Authorization & Single Sign-On
│   │   ├── auth_authz_sso_architecture.docx          Reference document (31-section)
│   │   └── auth_authz_sso_architecture_deck.pptx     Slide deck (31 slides)
│   │
│   ├── IGA/                        Identity Governance & Administration
│   │   ├── iga_architecture.docx                     Reference document
│   │   └── iga_architecture_deck.pptx                Slide deck (29 slides)
│   │
│   └── PAM/                        Privileged Access Management
│       ├── pam_architecture.docx                     Reference document
│       └── pam_architecture_deck.pptx                Slide deck
│
├── gpt_architecture.docx           AI/LLM Security Architecture reference
├── gpt_architecture_deck.pptx      AI/LLM Security slide deck
│
├── kubernetes_architecture_v2.docx             Kubernetes Security Architecture reference
├── k8s_security_architecture.docx              Kubernetes Security Architecture (alt version)
└── kubernetes_architecture_deck_v2_1.pptx      Kubernetes Security slide deck
```

---

## Document Summaries

### IAM — Identity & Access Management

#### SSO: Authentication, Authorization & Single Sign-On (`IAM/SSO/`)

Covers the full AuthN/AuthZ/SSO architecture domain including:

- Core concepts: AuthN vs. AuthZ vs. SSO vs. OAuth 2.0
- MFA and passwordless authentication — FIDO2/WebAuthn, passkeys, TOTP, PIV/smart cards
- SSO reference architecture — Internal (Kerberos/AD) vs. Federated (SAML 2.0, OIDC)
- SAML 2.0 vs. OIDC/OAuth 2.0 comparison and token types
- Token lifecycle and validation architecture (JWT self-validation, Token Introspection, Hybrid)
- Authorization models — RBAC, ABAC, OPA (Policy-as-Code)
- Identity Control Plane architecture (5-layer model)
- Zero Trust identity integration — CAEP/CAE, DPoP, ZTNA
- Identity attack surface and MITRE ATT&CK mapping (T1078, T1539, T1606, T1621, T1111)
- Modern identity for APIs and M2M (OAuth 2.0 flows, mTLS, DPoP)
- Vendor landscape — Microsoft Entra ID, Okta, Ping Identity, Keycloak, ADFS
- NIST SP 800-53 Rev 5 and NIST SP 800-63B control mapping

Frameworks: NIST SP 800-53 Rev 5 | NIST SP 800-63B | NIST SP 800-207 (Zero Trust) | MITRE ATT&CK

#### IGA: Identity Governance & Administration (`IAM/IGA/`)

Covers the full IGA domain including:

- Joiner-Mover-Leaver (JML) lifecycle and provisioning workflows
- Access certification and access review processes
- Segregation of Duties (SoD) policy and conflict detection
- Role management (RBAC foundation for IGA)
- SCIM 2.0 provisioning for SaaS and cloud targets (AD via LDAP/AD API)
- PAM integration — privileged access governance
- CIEM integration — cloud entitlement visibility
- Identity Analytics and anomaly detection
- Identity Architecture Reference Model (5-layer: HRMS → IGA → IdP/PAM → Targets)
- IGA vs. IdP vs. PAM responsibility model
- Identity Attack Path example with IGA/IdP/PAM/CIEM controls
- MITRE ATT&CK mapping (T1087, T1078, T1098, T1136)
- NIST SP 800-53 AC-2, AC-5, AC-6 control mapping

Frameworks: NIST SP 800-53 Rev 5 | MITRE ATT&CK | NIST SP 800-207 (Zero Trust)

#### PAM: Privileged Access Management (`IAM/PAM/`)

Covers the full PAM domain including:

- Privileged account types and risk classification
- PAM architecture — vaulting, session management, JIT access
- Credential vaulting and secret rotation
- Privileged session recording and monitoring
- Just-in-Time (JIT) elevation workflows
- PAM integration with IGA, IdP, and SIEM
- MITRE ATT&CK mapping for privileged access attacks
- NIST SP 800-53 control mapping (AC-2, AC-6, AU-2, IA-2)

Frameworks: NIST SP 800-53 Rev 5 | MITRE ATT&CK | CIS Controls

---

### AI/LLM Security Architecture (`gpt_architecture.*`)

Security architecture patterns for AI and Large Language Model deployments, covering threat modeling, data protection, access control, and governance for AI systems.

---

### Kubernetes Security Architecture (`kubernetes_architecture*`, `k8s_security_architecture.*`)

Security architecture for Kubernetes environments, covering cluster hardening, RBAC, network policies, secrets management, supply chain security, and runtime protection.

---

## Usage, License & Attribution

This repository is **freely available for use, adaptation, and redistribution** under the following terms:

- You may use these documents, slide decks, and frameworks for personal, educational, or commercial purposes.
- You may modify, extend, and build upon this work.
- You may redistribute original or modified versions.

**Required:** Proper credit must be given to the original author in any use, distribution, or derivative work.

> **Author:** Eran Shpigelman
> **Contact:** eransh10@gmail.com

Attribution should appear in the document, presentation, or wherever the work is shared — a note such as:
*"Based on work by Eran Shpigelman (eransh10@gmail.com)"* is sufficient.

---

## Frameworks Referenced

| Framework | Domain |
|-----------|--------|
| NIST SP 800-53 Rev 5 | Security and Privacy Controls |
| NIST SP 800-63B | Digital Identity Guidelines (AuthN Assurance Levels) |
| NIST SP 800-207 | Zero Trust Architecture |
| MITRE ATT&CK | Adversarial Tactics, Techniques & Procedures |
| CIS Controls v8 | Implementation Groups for security baselines |
| RFC 9449 (DPoP) | OAuth 2.0 Demonstrating Proof of Possession |
| RFC 7662 | OAuth 2.0 Token Introspection |
| SCIM 2.0 (RFC 7644) | System for Cross-domain Identity Management |

---

## Version History

| Date | Change |
|------|--------|
| March 2026 | Added IAM folder structure (SSO, IGA, PAM); updated SSO deck (31 slides, 12 technical corrections, 4 new slides); updated IGA deck (29 slides, 9 corrections, 3 new slides) |
| March 2026 | Initial repository with SSO, IGA, PAM, Kubernetes, and AI/LLM architecture documents |

---

*Maintained by Eran Shpigelman — eransh10@gmail.com*
