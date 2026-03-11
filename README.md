# Security Architecture Guidelines & Best Practices

A structured reference library of security architecture documents, slide decks, and implementation guidance covering Identity & Access Management, Cloud Security, Kubernetes security, and AI/LLM security design patterns.

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
│   ├── cloud_security_architecture.docx         Reference document (12-section, 816+ paragraphs)
│   ├── cloud_security_architecture_deck.pptx    Slide deck (45 slides)
│   └── build_cloud_doc.js                       Source builder (docx-js)
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

Prescriptive, provider-specific security architecture for AWS, Azure, and GCP with a Zero Trust emphasis. 12-section reference document (816+ paragraphs) and a 45-slide deck.

#### Reference Document — 12 Sections

1. **Core Security Principles** — Zero Trust, shared responsibility, operational sustainability, machine identity as a first-class concern
2. **AWS** — SCPs, IRSA/EKS Pod Identity, Permission Boundaries, PrivateLink, KMS CMKs, GuardDuty, Security Hub, Control Tower; machine identity governance, service-to-service Zero Trust, dynamic secrets, runtime detection, supply chain security
3. **Azure** — Managed Identities, PIM, Conditional Access, Private Endpoints, Key Vault CMK, Defender for Cloud, Sentinel; DSPM with Microsoft Purview
4. **GCP** — Workload Identity Federation, VPC Service Controls, Cloud KMS/CMEK, Secret Manager, SCC, Chronicle SIEM; Org Policy governance
5. **Advanced Security Domains** (cross-cloud) — Machine Identity Governance, Service-to-Service Zero Trust (SPIFFE/SPIRE, Istio mTLS), Dynamic Secrets Architecture (HashiCorp Vault), DSPM (Discover → Classify → Monitor), Runtime Threat Detection (Falco/eBPF, GuardDuty, UEBA), Software Supply Chain Security (SBOM, Sigstore/Cosign, SLSA Level 3), Centralized Identity and Logging Architecture
6. **Multi-Cloud Zero Trust** — unified IdP federation, cross-cloud workload identity, private cross-cloud connectivity, multi-cloud SecOps stack
7. **MITRE ATT&CK for Cloud** — technique table (T1078.004, T1530, T1537, T1098.001, T1190, T1552.005, T1136.003, T1580, T1619)
8. **NIST SP 800-53 Rev 5** — control mapping across all three providers (AC-2, AC-3, AC-17, AU-2, AU-9, IA-5, SC-7, SC-8, SC-28, SI-3)
9. **Implementation Roadmap** — 4 phases (0–30 days through 180 days+) with success metrics
10. **AI Security and LLM Governance** — OWASP LLM Top 10, prompt injection, data leakage, NIST AI RMF (Govern/Map/Measure/Manage)
11. **Cloud Attack Path Analysis** — graph-based privilege escalation analysis, Wiz / BloodHound / Defender tooling
12. **Operational Security Metrics** — IAM, detection, data protection, and supply chain KPIs with targets and remediation SLAs

**Key Takeaways** — 8 strategic principles synthesizing the full document

#### Slide Deck — 45 Slides across 10 Sections

| Section | Slides | Content |
|---------|--------|---------|
| 01 Introduction | 1–4 | Title, agenda, Zero Trust principles, shared responsibility |
| 02 Core Principles | 5 | 5 architectural principles |
| 03 AWS | 6–11 | IAM, Network, Data, Detection, Governance, Machine Identity |
| 04 Azure | 12–17 | Identity, Network, Data, Defender, DSPM |
| 05 GCP | 18–22 | IAM, Network, Data, SCC, Governance |
| 06 Advanced Domains | 23–29 | Machine Identity, Service ZT, Dynamic Secrets, DSPM, Runtime, Supply Chain |
| 07 Multi-Cloud ZT | 30–32 | Identity federation, cross-cloud connectivity, SecOps stack |
| 08 Frameworks | 33–37 | MITRE ATT&CK for Cloud, NIST SP 800-53 mapping |
| 09 Roadmap | 38–39 | Phased implementation roadmap |
| 10 AI · Attacks · Metrics | 40–45 | AI Security, Attack Path Analysis, Operational Metrics, Closing |

Frameworks: NIST SP 800-53 Rev 5 | MITRE ATT&CK for Cloud | CIS Benchmarks (AWS/Azure/GCP) | AWS FSBP | Microsoft CAF | GCP Security Foundations Blueprint | NIST AI RMF | SLSA | SPIFFE/SPIRE | OWASP LLM Top 10

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
| NIST AI RMF | AI Risk Management Framework (Govern, Map, Measure, Manage) |
| MITRE ATT&CK | Adversarial Tactics, Techniques & Procedures |
| MITRE ATT&CK for Cloud | Cloud-specific adversary techniques (IaaS, SaaS, Office 365) |
| MITRE ATLAS | Adversarial Threat Landscape for AI Systems |
| CIS Controls v8 | Implementation Groups for security baselines |
| CIS Benchmarks | CIS AWS Foundations, CIS Azure Foundations, CIS GCP Foundations |
| RFC 9449 (DPoP) | OAuth 2.0 Demonstrating Proof of Possession |
| RFC 7662 | OAuth 2.0 Token Introspection |
| SCIM 2.0 (RFC 7644) | System for Cross-domain Identity Management |
| AWS Foundational Security Best Practices (FSBP) | AWS Security Hub standard |
| Microsoft Cloud Adoption Framework (CAF) | Azure landing zone security architecture |
| GCP Security Foundations Blueprint | GCP organization-level security baseline |
| SPIFFE / SPIRE | Workload identity standard for service-to-service Zero Trust |
| SLSA (Supply-chain Levels for Software Artifacts) | Software supply chain integrity framework (target: Level 3) |
| OWASP LLM Top 10 | Top security risks for Large Language Model applications |

---

## Version History

| Date | Change |
|------|--------|
| March 2026 | Cloud: added Section 5 Advanced Security Domains (Machine Identity, Service-to-Service ZT, Dynamic Secrets, DSPM, Runtime Detection, Supply Chain, Centralized Identity & Logging); added Key Takeaways; renumbered sections 6–12; document now 816+ paragraphs |
| March 2026 | Cloud: expanded deck from 33 to 45 slides — 10 new domain slides, 3 fixes, updated agenda; added Section 05 Advanced Security Domains and Section 10 AI/Attacks/Metrics to deck |
| March 2026 | Cloud: 14 precision corrections to reference document (MITRE naming, language softening, service mesh caveat, operational sustainability principle, Operational Security Metrics section) |
| March 2026 | Added Cloud Security Architecture (AWS/Azure/GCP): 33-slide deck + 8-section reference document; MITRE ATT&CK for Cloud + NIST SP 800-53 mapping; Multi-Cloud Zero Trust architecture |
| March 2026 | Added IAM folder structure (SSO, IGA, PAM); updated SSO deck (31 slides, 12 technical corrections, 4 new slides); updated IGA deck (29 slides, 9 corrections, 3 new slides) |
| March 2026 | Initial repository with SSO, IGA, PAM, Kubernetes, and AI/LLM architecture documents |

---

*Maintained by Eran Shpigelman — eransh10@gmail.com*
