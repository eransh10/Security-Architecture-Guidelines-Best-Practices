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
├── Cloud/                          Cloud Security Architecture (AWS · Azure · GCP)
│   ├── cloud_security_architecture.docx         Reference document (8-section, 550+ paragraphs)
│   └── cloud_security_architecture_deck.pptx    Slide deck (33 slides)
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

### Cloud Security Architecture (`Cloud/`)

Prescriptive, provider-specific security architecture covering AWS, Azure, and GCP with a Zero Trust emphasis. Includes:

- Executive Summary: Zero Trust principles, Shared Responsibility Model
- AWS: SCPs, IRSA, Permission Boundaries, PrivateLink, KMS CMKs, GuardDuty, Security Hub, Control Tower
- Azure: Managed Identities, PIM, Conditional Access, Private Endpoints, Key Vault CMK, Defender for Cloud, Sentinel
- GCP: Workload Identity Federation, VPC Service Controls, Cloud KMS/CMEK, Secret Manager, SCC, Chronicle SIEM
- Multi-Cloud Zero Trust: unified identity federation, cross-cloud workload identity, centralized SIEM, CSPM stack
- MITRE ATT&CK Cloud technique table (T1078.004, T1530, T1537, T1098.001, T1190, T1552.005, T1136.003, T1580, T1619)
- NIST SP 800-53 Rev 5 control mapping: AC-2, AC-3, AC-17, AU-2, AU-9, IA-5, SC-7, SC-8, SC-28, SI-3
- Implementation Roadmap: 4 phases (0–30 days through 180 days+) with success metrics

Deck: 33 slides. Document: 8 sections, 550+ paragraphs.

Frameworks: NIST SP 800-53 Rev 5 | MITRE ATT&CK Cloud | CIS Benchmarks (AWS/Azure/GCP) | AWS FSBP | Microsoft CAF | GCP Security Foundations Blueprint

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
| MITRE ATT&CK Cloud | Cloud-specific adversary techniques (IaaS, SaaS, Office 365) |
| CIS Benchmarks | CIS AWS Foundations, CIS Azure Foundations, CIS GCP Foundations |
| AWS Foundational Security Best Practices (FSBP) | AWS Security Hub standard |
| Microsoft Cloud Adoption Framework (CAF) | Azure landing zone security architecture |
| GCP Security Foundations Blueprint | GCP organization-level security baseline |

---

## Version History

| Date | Change |
|------|--------|
| March 2026 | Added Cloud Security Architecture (AWS/Azure/GCP): 33-slide deck + 8-section reference document; MITRE ATT&CK Cloud + NIST SP 800-53 mapping; Multi-Cloud Zero Trust architecture |
| March 2026 | Added IAM folder structure (SSO, IGA, PAM); updated SSO deck (31 slides, 12 technical corrections, 4 new slides); updated IGA deck (29 slides, 9 corrections, 3 new slides) |
| March 2026 | Initial repository with SSO, IGA, PAM, Kubernetes, and AI/LLM architecture documents |

---

*Maintained by Eran Shpigelman — eransh10@gmail.com*
