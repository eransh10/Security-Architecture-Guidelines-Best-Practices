#!/usr/bin/env node
"use strict";

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber,
  PageBreak, TableOfContents
} = require('/sessions/trusting-sleepy-archimedes/.npm-global/lib/node_modules/docx');
const fs = require('fs');

// ─── Constants ─────────────────────────────────────────────────────────────
const NAVY    = "0F4C75";
const CLOUD   = "1565C0";
const AWS_ORG = "FF9900";
const AZURE   = "0078D4";
const GCP_BLU = "4285F4";
const AMBER   = "F4A261";
const RED     = "C62828";
const GREEN   = "2E7D32";
const DARKGRAY= "37474F";
const MIDGRAY = "90A4AE";
const LTGRAY  = "F5F6FA";
const WHITE   = "FFFFFF";

const DXA = WidthType.DXA;
const PAGE_W = 9360; // US Letter - 1" margins each side = 9360 DXA

// ─── Borders ────────────────────────────────────────────────────────────────
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noAllBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: NAVY })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: CLOUD })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: DARKGRAY })]
  });
}

function para(text, opts) {
  opts = opts || {};
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({
      text,
      font: opts.font || "Calibri",
      size: opts.size || 22,
      color: opts.color || DARKGRAY,
      bold: opts.bold || false,
      italics: opts.italic || false
    })]
  });
}

function spacer(n) {
  const arr = [];
  for (let i = 0; i < (n || 1); i++) {
    arr.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }
  return arr;
}

function bulletList(items, opts) {
  opts = opts || {};
  return items.map(item => new Paragraph({
    numbering: { reference: "bullets", level: opts.level || 0 },
    spacing: { before: 30, after: 30 },
    children: [new TextRun({
      text: item,
      font: "Calibri",
      size: opts.size || 20,
      color: opts.color || DARKGRAY
    })]
  }));
}

function sectionDivider(title, subtitle, accentColor) {
  const rows = [];
  // Accent header row
  rows.push(new TableRow({
    children: [new TableCell({
      borders: noAllBorders,
      shading: { fill: accentColor, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 100, left: 200, right: 200 },
      width: { size: PAGE_W, type: DXA },
      children: [
        new Paragraph({
          children: [new TextRun({ text: title, font: "Arial", size: 40, bold: true, color: WHITE })]
        }),
        ...(subtitle ? [new Paragraph({
          spacing: { before: 40 },
          children: [new TextRun({ text: subtitle, font: "Calibri", size: 20, color: WHITE })]
        })] : [])
      ]
    })]
  }));
  return new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [PAGE_W],
    rows,
    borders: noAllBorders
  });
}

function noteBox(text, color) {
  return new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [PAGE_W],
    rows: [new TableRow({
      children: [new TableCell({
        shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
        borders: { top: thinBorder, bottom: thinBorder, left: { style: BorderStyle.SINGLE, size: 8, color }, right: noBorder },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        width: { size: PAGE_W, type: DXA },
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text, font: "Calibri", size: 19, color: DARKGRAY })]
        })]
      })]
    })]
  });
}

function twoColTable(col1Header, col2Header, rows, w1, w2) {
  w1 = w1 || 4680; w2 = w2 || PAGE_W - w1;
  const hdrRow = new TableRow({
    children: [
      new TableCell({
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        borders: allBorders,
        width: { size: w1, type: DXA },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: col1Header, font: "Arial", size: 20, bold: true, color: WHITE })] })]
      }),
      new TableCell({
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        borders: allBorders,
        width: { size: w2, type: DXA },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: col2Header, font: "Arial", size: 20, bold: true, color: WHITE })] })]
      })
    ]
  });

  const dataRows = rows.map((row, ri) => {
    const bg = ri % 2 === 0 ? LTGRAY : WHITE;
    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: bg, type: ShadingType.CLEAR },
          borders: allBorders,
          width: { size: w1, type: DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: row[0], font: "Calibri", size: 19, bold: row[2] || false, color: row[3] || DARKGRAY })] })]
        }),
        new TableCell({
          shading: { fill: bg, type: ShadingType.CLEAR },
          borders: allBorders,
          width: { size: w2, type: DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: row[1], font: "Calibri", size: 19, color: DARKGRAY })] })]
        })
      ]
    });
  });

  return new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [w1, w2],
    rows: [hdrRow, ...dataRows],
    borders: allBorders
  });
}

// ─── Document Content ─────────────────────────────────────────────────────────

const children = [];

// ─── Cover ───────────────────────────────────────────────────────────────────
children.push(
  ...spacer(3),
  new Paragraph({
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "Cloud Security Architecture", font: "Arial", size: 56, bold: true, color: NAVY })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "Best Practices for AWS  ·  Azure  ·  GCP", font: "Arial", size: 36, color: CLOUD })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: "Security Architecture Reference  |  March 2026", font: "Calibri", size: 22, color: MIDGRAY })]
  }),
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: AMBER, space: 1 } },
    spacing: { before: 120, after: 200 },
    children: []
  }),
  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "Author: Eran Shpigelman", font: "Calibri", size: 22, color: DARKGRAY })]
  }),
  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "Contact: eransh10@gmail.com", font: "Calibri", size: 22, color: DARKGRAY })]
  }),
  ...spacer(2),
  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "Frameworks: NIST SP 800-53 Rev 5  ·  MITRE ATT&CK for Cloud  ·  CIS Benchmarks  ·  CSA CCM  ·  NIST AI Risk Management Framework  ·  SLSA Software Supply Chain Framework", font: "Calibri", size: 19, color: MIDGRAY, italics: true })]
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ─── Table of Contents ────────────────────────────────────────────────────────
children.push(
  new Paragraph({
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: "Table of Contents", font: "Arial", size: 36, bold: true, color: NAVY })]
  }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [new PageBreak()] })
);

// ─── 1. Executive Summary ─────────────────────────────────────────────────────
children.push(
  h1("1. Executive Summary"),
  para("Cloud security is not a single product. It is an architecture composed of identity controls, network isolation, secure software delivery, and continuous detection. This reference document provides prescriptive, technically-detailed security controls for Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP), covering identity and access management, network security, data protection, detection and response, and governance."),
  para("The foundational posture is Zero Trust: no implicit trust based on network location. Every request, API call, and workload interaction must be authenticated, authorized, and continuously validated. The controls in this document are mapped to MITRE ATT&CK for Cloud and NIST SP 800-53 Rev 5 to support compliance reporting and threat modeling."),
  spacer(1)[0],
  h2("1.1 Core Security Principles"),
  ...bulletList([
    "Identity is the perimeter. Workload identity (IRSA, Managed Identity, Workload Identity Federation) replaces network perimeters. No long-lived credentials.",
    "Private by default. Cloud services should be accessed through private endpoints whenever possible. Public exposure must be minimized and justified through documented exception processes.",
    "Encrypt all sensitive data. Use customer-managed keys (CMKs) where regulatory, operational, or separation-of-duty requirements apply. TLS 1.2+ in transit. Secrets managed via dedicated vaults.",
    "Policy-as-Code enforces guardrails. SCPs (AWS), Azure Policy, and Org Policy Constraints prevent misconfigurations before deployment.",
    "Detect at cloud scale. Native CSPM (Security Hub, Defender for Cloud, SCC), behavioral analytics (GuardDuty, Sentinel, Chronicle), and centralized SIEM.",
  ]),
  spacer(1)[0],
  para("Machine identities are the new attack surface. Cloud environments contain significantly more non-human identities than human users. Workloads must authenticate using federated workload identity and short-lived tokens instead of long-lived credentials."),
  para("All service-to-service communication must follow Zero Trust principles. Mutual authentication, strong workload identity, and policy-based authorization must be enforced for east-west traffic between services."),
  para("Software supply chain integrity is mandatory. All build artifacts must be generated through trusted CI/CD pipelines with signed provenance and verifiable build metadata."),
  para("Security controls must be operationally sustainable. Architectures that are too complex to operate consistently create their own risk surface. Automation, observability, and runbook clarity are security requirements, not operational afterthoughts. When a control cannot be maintained reliably at scale, it will degrade silently and fail at the worst time."),
  spacer(1)[0],
  h2("1.2 Shared Responsibility Model"),
  para("Cloud providers secure the infrastructure; customers own everything from the operating system up. The table below summarizes responsibility across layers and providers."),
  spacer(1)[0],
  new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [1760, 1900, 1900, 1900, 1900],
    rows: [
      new TableRow({ children: ["Layer","Customer","AWS","Azure","GCP"].map((h, ci) => new TableCell({ shading: { fill: NAVY, type: ShadingType.CLEAR }, borders: allBorders, width: { size: ci===0?1760:1900, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 19, bold: true, color: WHITE })] })] })) }),
      ...["Data,Full ownership,Tools only,Tools only,Tools only",
          "Identity & Access,Full ownership,IAM primitives,Entra ID primitives,IAM primitives",
          "App / Workload,Full ownership,Runtime environment,Runtime environment,Runtime environment",
          "Network Controls,Customer-configured,VPC infrastructure,VNet infrastructure,VPC infrastructure",
          "OS / Container,Customer (IaaS),PaaS/SaaS: shared,PaaS/SaaS: shared,PaaS/SaaS: shared",
          "Physical,None,Full ownership,Full ownership,Full ownership"
        ].map((rowStr, ri) => {
          const vals = rowStr.split(",");
          const bg = ri % 2 === 0 ? LTGRAY : WHITE;
          return new TableRow({ children: vals.map((v, ci) => new TableCell({ shading: { fill: bg, type: ShadingType.CLEAR }, borders: allBorders, width: { size: ci===0?1760:1900, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: v, font: "Calibri", size: 18, bold: ci===0, color: DARKGRAY })] })] })) });
        })
    ]
  }),
  spacer(1)[0]
);

// ─── 2. AWS Security Architecture ────────────────────────────────────────────
children.push(
  h1("2. AWS Security Architecture"),
  para("AWS security architecture relies on a layered control model combining organizational guardrails, identity controls, network segmentation, and centralized detection. Service Control Policies (SCPs) establish org-wide boundaries, IAM roles govern workload permissions, VPC configurations enforce network isolation, and AWS-native detection services provide continuous threat visibility."),

  h2("2.1 Identity & Access Management"),
  h3("Service Control Policies (SCPs)"),
  para("SCPs are attached at the AWS Organizations level and define the maximum permissions any principal in a member account can have. They do not grant permissions — they restrict them. Critical SCPs to implement:"),
  ...bulletList([
    "Deny all AWS regions except approved list (aws:RequestedRegion condition)",
    "Deny root account API usage (prevent root access key creation)",
    "Deny disabling GuardDuty, CloudTrail, or Security Hub",
    "Deny creation of IAM users and access keys (enforce IRSA/SSO only)",
    "Deny internet gateway creation in non-DMZ accounts",
    "Deny s3:PutBucketPublicAccessBlock with BlockPublicAcls=false"
  ]),
  h3("Workload Identity (IRSA and Instance Profiles)"),
  para("IAM Roles for Service Accounts (IRSA) binds a Kubernetes ServiceAccount to an IAM role via OIDC token federation. The pod receives short-lived credentials issued by AWS STS through OIDC federation. No static credentials are stored in the workload."),
  ...bulletList([
    "Configure EKS OIDC provider and annotate ServiceAccount with iam.amazonaws.com/role-arn",
    "Trust policy: restrict to specific namespace/service-account combination",
    "ECS Task Roles: assign IAM role to ECS TaskDefinition, not to the host EC2 instance",
    "EC2 Instance Profiles for legacy workloads — never allow iam:PassRole to broad roles",
    "Block ec2:AssociateIamInstanceProfile via SCP if not approved"
  ]),
  h3("Least Privilege Controls"),
  ...bulletList([
    "Permission Boundaries: cap maximum permissions delegated to roles created by automation",
    "IAM Access Analyzer: identify cross-account and public access; trigger on unused access findings",
    "IAM Access Advisor: review last-accessed data quarterly; remove unused permissions",
    "Resource-based policies: use aws:PrincipalOrgID condition to restrict cross-account access",
    "Avoid wildcard (*) actions in production IAM roles unless explicitly required and documented through exception review; prefer specific service:Action pairs"
  ]),
  spacer(1)[0],
  noteBox("Zero standing access: Use AWS IAM Identity Center session duration controls combined with PIM-style just-in-time elevation for privileged operations. Implement Vault AWS Secrets Engine or AWS IAM Roles Anywhere for programmatic JIT access.", AWS_ORG),
  spacer(1)[0],

  h3("2.1.1 Machine Identity Governance"),
  para("Machine identities (IAM roles, service accounts, workload identities) often outnumber human users by an order of magnitude in cloud environments and require equivalent governance controls."),
  para("Required controls:"),
  ...bulletList([
    "Maintain centralized inventory of all workload identities",
    "Enforce short-lived credentials via AWS STS",
    "Detect unused IAM roles and remove stale identities",
    "Restrict cross-account role assumption using aws:PrincipalOrgID",
    "Monitor excessive privilege escalation paths via IAM Access Analyzer",
  ]),
  para("Machine identities must follow the same lifecycle governance as human identities including provisioning, review, and decommissioning."),
  spacer(1)[0],

  h2("2.2 Network Security"),
  h3("VPC Design"),
  para("Multi-AZ, multi-subnet VPC architecture with strict tier separation:"),
  ...bulletList([
    "Public subnet: Only Application Load Balancers and NAT Gateways. No EC2 instances.",
    "Private subnet: Compute workloads (EC2, ECS, EKS). Access via ALB only.",
    "Isolated subnet: Databases (RDS, Aurora, DynamoDB VPC endpoints). No direct compute access.",
    "No public IPs assigned to EC2 instances — enforce via SCP (ec2:AssociatePublicIpAddress deny)",
    "Use VPC endpoints for high-risk services such as S3, DynamoDB, SSM, ECR, Secrets Manager, and KMS to prevent data exfiltration via public internet paths"
  ]),
  h3("PrivateLink"),
  para("AWS PrivateLink enables private connectivity to AWS services and your own services across VPCs and accounts without routing traffic through the public internet. Use PrivateLink for all inter-account service communication."),
  h3("Security Groups and NACLs"),
  ...bulletList([
    "Security Groups: stateful; allow-list only; source by SG reference, not CIDR. No 0.0.0.0/0 inbound.",
    "NACLs: stateless second layer; explicit deny for known malicious CIDRs; deny all inbound by default.",
    "AWS WAF on all ALBs and CloudFront: Managed Rule Groups (AWSManagedRulesCommonRuleSet, AWSManagedRulesKnownBadInputsRuleSet).",
    "AWS Network Firewall or third-party firewall appliances in an inspection VPC for controlled egress inspection and domain filtering.",
    "Shield Advanced on all internet-facing resources (ALBs, CloudFront, Route 53, Elastic IPs)."
  ]),
  spacer(1)[0],

  h3("2.2.1 Service-to-Service Zero Trust"),
  para("Traditional network segmentation alone does not adequately protect east-west service communication in cloud environments. All service communication must be authenticated and authorized using strong workload identity."),
  para("Recommended controls:"),
  ...bulletList([
    "Mutual TLS (mTLS) authentication between services",
    "Identity-based authorization policies for service communication",
    "Layer 7 inspection of internal service traffic",
    "Service mesh enforcement for containerized workloads",
  ]),
  para("Example technologies:"),
  ...bulletList([
    "Istio or Linkerd service mesh",
    "SPIFFE/SPIRE workload identity standard",
    "Envoy proxy policy enforcement",
  ]),
  noteBox("Outcome: Every service interaction is authenticated, encrypted, and authorized regardless of network location.", CLOUD),
  para("Service mesh adoption introduces operational complexity. Organizations should assess readiness in areas such as control plane reliability, certificate lifecycle management, observability tooling, and team expertise before mandating mesh across all workloads. Phased adoption starting with high-risk services is a common and pragmatic pattern."),
  spacer(1)[0],

  h2("2.3 Data Protection"),
  h3("Key Management Service (KMS CMKs)"),
  para("All data at rest must be encrypted. AWS-managed keys may be insufficient for regulated workloads requiring strict key ownership, separation of duties, or external auditability. Customer-managed keys (CMKs) provide the necessary control plane separation for those scenarios."),
  ...bulletList([
    "CMK key policies: require aws:PrincipalOrgID condition to prevent cross-org key usage",
    "Deny kms:* for principals outside the organization",
    "Automatic key rotation enabled (annual) for all symmetric CMKs",
    "Use AWS CloudHSM for workloads requiring FIPS 140-2 Level 3 validated hardware key protection (PCI DSS, FedRAMP High)",
    "Key aliases: enforce naming convention (alias/prod/service/purpose)"
  ]),
  h3("S3 Data Governance"),
  ...bulletList([
    "S3 Block Public Access: enabled at account level via SCP — cannot be overridden",
    "S3 Bucket Policy: deny s3:PutObject without x-amz-server-side-encryption-aws-kms-key-id",
    "S3 Object Ownership: BucketOwnerEnforced (disables ACLs entirely)",
    "S3 Versioning + MFA Delete on buckets containing sensitive/compliance data",
    "Lifecycle rules: transition to S3 Intelligent-Tiering; expire stale data per retention policy"
  ]),
  h3("Secrets Manager and Parameter Store"),
  ...bulletList([
    "Application secrets such as database credentials, API keys, and OAuth tokens should be stored in a dedicated secrets management system such as AWS Secrets Manager or HashiCorp Vault",
    "Lambda rotation function: automatic rotation on configurable schedule",
    "Never store secrets in SSM Parameter Store Standard (no encryption by default) — use SecureString",
    "Access via IAM role with secretsmanager:GetSecretValue — never cross-account without VPC endpoint",
    "Amazon Macie: enable on all S3 buckets to discover PII, PHI, PCI data; forward findings to Security Hub"
  ]),
  spacer(1)[0],

  h3("2.3.1 Dynamic Secrets and Credential Rotation"),
  para("Static application secrets significantly increase the risk of credential compromise. Applications must retrieve secrets dynamically at runtime rather than storing credentials in configuration files or source code."),
  para("Recommended controls:"),
  ...bulletList([
    "AWS Secrets Manager automatic rotation via Lambda rotation functions",
    "Dynamic credentials issued by secrets management systems (e.g., HashiCorp Vault dynamic secrets)",
    "Short-lived secret leases with automatic expiration",
    "Kubernetes External Secrets Operator for injecting secrets into pods at runtime",
  ]),
  noteBox("Outcome: Application credentials are short-lived and automatically rotated, significantly reducing credential exposure risk.", AWS_ORG),
  spacer(1)[0],

  h2("2.4 Detection and Response"),
  h3("Core Detection Stack"),
  ...bulletList([
    "CloudTrail: organization trail enabled; management events on all accounts; data events on sensitive S3 + Lambda. Log integrity validation enabled. Logs shipped to central Security account S3 bucket with Object Lock.",
    "GuardDuty: enabled in all regions in all accounts via organization enrollment. Enable S3 Protection, EKS Runtime Protection, Lambda Protection, Malware Protection. Findings aggregated to Security Hub in Security account.",
    "AWS Config: enable all supported resources in all regions. Conformance Packs: CIS AWS Foundations Benchmark v1.4, NIST SP 800-53 Rev 5, PCI DSS v3.2.1. Auto-remediation via SSM Automation documents for critical rules.",
    "AWS Security Hub: aggregated findings from GuardDuty, Inspector, Macie, Config, IAM Access Analyzer, Firewall Manager. Enable AWS Foundational Security Best Practices (FSBP) standard.",
    "AWS Inspector: continuous CVE scanning for EC2 instances, Lambda functions, and ECR container images. Risk-scored findings with package-level remediation guidance.",
    "VPC Flow Logs: enable on all VPCs; ship to S3 or CloudWatch Logs; feed into Athena for anomaly queries."
  ]),
  spacer(1)[0],

  h3("2.4.1 Runtime Threat Detection"),
  para("Traditional log-based detection mechanisms identify threats after malicious activity has already occurred. Runtime security platforms monitor system behavior within active workloads to detect attacks in real time."),
  para("Key capabilities:"),
  ...bulletList([
    "Container runtime monitoring (system call auditing at kernel level)",
    "Detection of container escape attempts",
    "Detection of cryptocurrency mining and malicious processes",
    "Behavioral anomaly detection for workloads",
  ]),
  para("Example technologies:"),
  ...bulletList([
    "Falco runtime security (CNCF graduated project; eBPF or kernel module)",
    "AWS GuardDuty Runtime Monitoring (EKS and EC2)",
    "Microsoft Defender for Containers (runtime behavioral analysis)",
    "eBPF-based sensors: Tetragon (Cilium), Tracee (Aqua)",
  ]),
  noteBox("Outcome: Threats are detected during execution rather than after log ingestion, reducing mean time to detect (MTTD) significantly.", RED),
  spacer(1)[0],

  h2("2.5 Governance and CSPM"),
  ...bulletList([
    "AWS Control Tower: landing zone with mandatory guardrails (disallow root keys, disallow public S3, disallow IGW on restricted accounts). Centralized logging account and audit account.",
    "Resource Tag Policies: enforce owner, env, classification, cost-center tags via Organizations tag policy.",
    "AWS Backup: backup plans per data classification. Backup Vault Lock for WORM protection against ransomware. Cross-region replication for critical data.",
    "AWS Cost Anomaly Detection: monitor spend per linked account and tag; alert on deviations > 20%.",
    "Service Catalog: pre-approved, security-compliant infrastructure products for self-service deployment."
  ]),
  spacer(1)[0],

  h3("2.5.1 Software Supply Chain Security"),
  para("Modern cloud environments depend heavily on third-party dependencies and automated build pipelines. Compromise of the software supply chain can introduce malicious code into production workloads without triggering traditional security controls."),
  para("Required controls:"),
  ...bulletList([
    "Software Bill of Materials (SBOM) generation during builds (CycloneDX or SPDX format)",
    "Signed container images and artifacts using asymmetric keys",
    "Provenance verification for build pipelines before deployment",
    "Dependency vulnerability scanning in CI/CD (SCA: Snyk, OWASP Dependency-Check, GitHub Dependabot)",
  ]),
  para("Standards and tools:"),
  ...bulletList([
    "SLSA (Supply chain Levels for Software Artifacts) framework: target SLSA Level 3 for production builds",
    "Sigstore / Cosign: keyless artifact signing using OIDC identity",
    "in-toto attestation framework: cryptographically verify each step in the build pipeline",
  ]),
  noteBox("Outcome: All deployed artifacts are cryptographically verifiable and traceable to a trusted build pipeline. Compromised dependencies are detected before reaching production.", GREEN),
  spacer(1)[0]
);

// ─── 3. Azure Security Architecture ──────────────────────────────────────────
children.push(
  h1("3. Azure Security Architecture"),
  para("Azure security architecture uses a Management Group hierarchy with inherited Azure Policy assignments, Entra ID as the identity provider with PIM for just-in-time elevation, and Microsoft Defender for Cloud as the unified CSPM and CWPP platform."),

  h2("3.1 Identity & Access Management"),
  h3("Managed Identities"),
  para("Managed Identities are the Azure equivalent of AWS IAM Roles — they provide an automatically managed identity for Azure resources without requiring credential management."),
  ...bulletList([
    "System-assigned Managed Identity: tied to resource lifecycle; auto-deleted with resource. Use for VMs, App Service, Functions.",
    "User-assigned Managed Identity: reusable across multiple resources; lifecycle managed independently. Use when multiple resources share the same identity.",
    "Access pattern: assign RBAC role on target resource (e.g., Key Vault Secrets User on Key Vault). Minimum scope — never subscription-level unless required.",
    "Block legacy authentication: Conditional Access policy — block all authentication flows except Modern Authentication (OAuth 2.0/OIDC)."
  ]),
  h3("Privileged Identity Management (PIM)"),
  ...bulletList([
    "All privileged roles (Global Admin, Subscription Owner, Contributor) must be eligible, not permanent",
    "JIT activation: maximum 8-hour duration; require justification and approval for Global Admin",
    "Access reviews: monthly for privileged roles; quarterly for member roles",
    "Alert on: permanent role assignments, role assignment outside PIM, Global Admin activation"
  ]),
  h3("Conditional Access"),
  ...bulletList([
    "Require MFA for all users — no exceptions. Use FIDO2 keys or Microsoft Authenticator (phishing-resistant).",
    "Require compliant device (Intune MDM enrollment) for access to production workloads",
    "Named Locations: restrict access to approved countries; block sign-in from anonymous proxies/Tor",
    "Sign-in risk policy: require MFA on medium risk; block on high risk (Entra ID Protection)",
    "Continuous Access Evaluation (CAE): M365 services re-evaluate token validity on session risk events"
  ]),
  spacer(1)[0],

  h2("3.2 Network Security"),
  h3("Hub-Spoke Architecture"),
  para("The Azure landing zone uses a hub-spoke VNet topology following the Microsoft Cloud Adoption Framework (CAF). The hub VNet contains shared network services; spoke VNets contain workload resources and peer to the hub."),
  ...bulletList([
    "Hub: Azure Firewall Premium, Azure Bastion, ExpressRoute/VPN gateway, DNS resolver",
    "Spoke peering: allow hub-to-spoke only; no spoke-to-spoke direct peering (all traffic via hub firewall)",
    "Dedicated spokes: production, non-production, identity (domain controllers), management",
    "Org Policy: prohibit VNet peering outside approved management group scope"
  ]),
  h3("Private Endpoints"),
  para("All Azure PaaS services must be accessed via Private Endpoint. After creating the private endpoint, disable public network access on the resource."),
  ...bulletList([
    "Services requiring private endpoints: Storage, Key Vault, SQL Database, Service Bus, Event Hub, ACR, AKS API server, App Service, Cosmos DB",
    "Private DNS Zones: one per service type; link to hub VNet for DNS resolution. Never use IP addresses directly.",
    "Azure Policy: DeployIfNotExists to auto-create private endpoints; Deny on public network access for applicable services"
  ]),
  h3("Azure Firewall and WAF"),
  ...bulletList([
    "Azure Firewall Premium: IDPS in Alert+Deny mode; TLS inspection for east-west and egress traffic; FQDN filtering for outbound",
    "Application Gateway WAF v2: Prevention mode; OWASP 3.2 ruleset; custom rules for rate limiting and bot protection",
    "NSGs: applied at subnet level with deny-all default; Application Security Groups for service-tag-free rules",
    "Azure DDoS Network Protection: Standard tier on all public VIPs"
  ]),
  spacer(1)[0],

  h2("3.3 Data Protection"),
  h3("Azure Key Vault (Customer-Managed Keys)"),
  ...bulletList([
    "Managed HSM: FIPS 140-2 Level 3; required for production encryption keys in regulated environments",
    "CMK for all storage accounts, Azure SQL, ADE (Disk Encryption), AKS etcd, Azure Monitor",
    "Key Vault Firewall: restrict access to approved VNets and private endpoint only. No public access.",
    "Soft delete (90 days) + purge protection enabled on all vaults — prevents accidental or malicious key deletion",
    "Access policy model replaced by RBAC (Key Vault Secrets Officer, Key Vault Crypto Officer)"
  ]),
  h3("Storage Security"),
  ...bulletList([
    "Azure Policy: Deny public blob access (storage.allowBlobPublicAccess = false)",
    "Secure transfer required: minimum TLS 1.2 enforced on all storage accounts",
    "Shared Key authorization disabled — use Entra ID RBAC for data plane access",
    "Immutable storage with time-based retention for compliance/audit data (WORM)",
    "Microsoft Defender for Storage Plan 2: on-upload malware scanning + anomalous activity detection"
  ]),
  h3("Microsoft Purview"),
  ...bulletList([
    "Sensitive data discovery across Azure Data Lake, Blob, SQL, Power BI",
    "DLP policies: block sharing of PII/PHI data via Teams, Exchange, SharePoint",
    "Information Protection labels: enforce throughout M365 and Azure data services",
    "Compliance Manager: track regulatory compliance posture and improvement actions"
  ]),
  spacer(1)[0],

  h2("3.4 Detection and Response"),
  h3("Microsoft Defender for Cloud (CSPM + CWPP)"),
  ...bulletList([
    "Enable all Defender Plans: Servers (Plan 2), Containers, App Service, SQL, Storage, Key Vault, Resource Manager, DNS, Open-Source Relational DBs",
    "Secure Score: track and report on security posture. Target 90%+ on production subscriptions.",
    "Multi-cloud connectors: onboard AWS accounts and GCP projects into Defender for Cloud for unified posture",
    "Attack path analysis: identifies exploitable kill chains across hybrid and multi-cloud environments"
  ]),
  h3("Microsoft Sentinel"),
  ...bulletList([
    "Data connectors: Entra ID (sign-in + audit), Microsoft 365 Defender, Defender for Cloud, Azure Activity, DNS, network flows",
    "UEBA: enable User and Entity Behavior Analytics; baseline per user/host/IP; anomaly detection",
    "Analytics rules: map to MITRE ATT&CK. Enable Microsoft Threat Intelligence rules for IOC matching.",
    "Playbooks (Logic Apps): automated response for high-confidence alerts (disable user, isolate host, revoke tokens)",
    "Threat Intelligence: import IOCs from TAXII feeds; Microsoft Threat Intelligence Platform integration"
  ]),
  h3("Entra ID Protection"),
  ...bulletList([
    "User Risk Policy: require password change + MFA on medium risk; block on high risk",
    "Sign-In Risk Policy: require MFA on medium risk sign-ins",
    "Risky sign-in signals: impossible travel, unfamiliar location, password spray, leaked credentials",
    "Risk findings exported to Sentinel via Entra ID diagnostic settings"
  ]),
  spacer(1)[0],

  h2("3.5 Governance and Policy"),
  ...bulletList([
    "Management Group hierarchy: Root MG → Platform (Connectivity, Identity, Management) → Landing Zones (Corp, Online) → Decommissioned. Policies applied at MG level for inheritance.",
    "Azure Policy initiatives: assign CIS Azure Foundations, NIST SP 800-53 R5, ISO 27001 built-in initiatives. Custom policies in Bicep via Azure DevOps / GitHub.",
    "Blueprints: Azure Landing Zone Bicep modules deployed via CI/CD. All production infrastructure via IaC — no manual resource creation.",
    "Resource Locks: CanNotDelete on production resource groups. Managed via Blueprints assignment.",
    "Cost Management: budget alerts at 80% and 100% per subscription. Anomaly alerts on tagged resources. Regular idle resource cleanup."
  ]),
  spacer(1)[0],

  h2("3.6 Data Security Posture Management (DSPM)"),
  para("Sensitive data often proliferates across cloud storage systems, databases, and data lakes without centralized visibility. DSPM platforms continuously discover and classify sensitive data across cloud environments to reduce exposure risk."),
  para("Controls:"),
  ...bulletList([
    "Automated discovery of sensitive data in storage accounts, databases, and data lake services",
    "Classification of PII, PCI, PHI, and regulated datasets with risk scoring",
    "Continuous monitoring for exposed or over-permissioned sensitive data",
    "Enforcement of encryption and access controls on data with high classification",
    "Data flow mapping: understand where sensitive data moves across environments",
  ]),
  para("Example technologies:"),
  ...bulletList([
    "Microsoft Purview (native Azure DSPM + DLP)",
    "Amazon Macie (S3-focused sensitive data discovery)",
    "Google Cloud DLP / Sensitive Data Protection",
    "Wiz DSPM (multi-cloud data risk visibility)",
  ]),
  noteBox("Outcome: Security teams maintain continuous visibility into sensitive data risk across the cloud estate, enabling proactive remediation of data exposure before it becomes a breach.", GCP_BLU),
  spacer(1)[0]
);

// ─── 4. GCP Security Architecture ────────────────────────────────────────────
children.push(
  h1("4. GCP Security Architecture"),
  para("GCP security architecture is organized around the Resource Hierarchy (Organization → Folders → Projects), with Org Policy Service constraints enforcing security guardrails, Workload Identity Federation eliminating service account keys, and Security Command Center providing unified CSPM and threat detection."),

  h2("4.1 Identity & Access Management"),
  h3("Workload Identity Federation"),
  para("Workload Identity Federation allows external workloads (GitHub Actions, AWS workloads, Kubernetes pods, Azure workloads) to authenticate to GCP without service account keys. The external identity token is exchanged for a short-lived GCP access token."),
  ...bulletList([
    "Configure Workload Identity Pool with appropriate issuer (GitHub OIDC, AWS STS, Azure AD)",
    "Attribute mappings: map external claims to Google attributes (e.g., attribute.repository = assertion.repository)",
    "Restrict attribute conditions: only allow specific repos, branches, or subjects",
    "Service account impersonation: grant iam.workloadIdentityUser role on the service account",
    "Audit: monitor serviceAccounts.actAs in Cloud Audit Logs for unexpected federation usage"
  ]),
  h3("IAM Best Practices"),
  ...bulletList([
    "Resource-level IAM bindings preferred over project-level for granular control",
    "Domain Restriction Constraint (iam.allowedPolicyMemberDomains): only allow identities from approved domains",
    "No service account keys: enforced via Org Policy (iam.disableServiceAccountKeyCreation)",
    "Service account minimum privilege: use IAM Conditions for time-limited, resource-specific access",
    "IAM Recommender: automatically identify and remove unused role bindings (review monthly)"
  ]),
  h3("Organization Policy Constraints"),
  ...bulletList([
    "compute.skipDefaultNetworkCreation: prevent default VPC creation in new projects",
    "compute.requireShieldedVm: enforce Secure Boot, vTPM, and Integrity Monitoring on all VMs",
    "iam.disableServiceAccountKeyCreation: no long-lived SA keys anywhere in org",
    "constraints/storage.uniformBucketLevelAccess: disable legacy ACLs on GCS buckets",
    "constraints/gcp.resourceLocations: restrict resources to approved regions",
    "constraints/compute.restrictCloudArmor: enforce Cloud Armor on all internet-facing LBs"
  ]),
  spacer(1)[0],

  h2("4.2 Network Security"),
  h3("VPC Architecture"),
  ...bulletList([
    "Shared VPC (XPN): central host project controls network; service projects attach and consume. Enables centralized firewall governance.",
    "No default VPC: enforced via Org Policy. All VPCs created explicitly with RFC 1918 CIDR ranges.",
    "Private Google Access: enable on subnets where VMs need access to Google APIs without external IPs.",
    "No external IPs unless explicitly required: enforce via Org Policy (compute.vmExternalIpAccess)"
  ]),
  h3("VPC Service Controls"),
  para("VPC Service Controls create a security perimeter around Google Cloud resources to mitigate data exfiltration risks. Services inside the perimeter can only communicate with each other and with specified external identities."),
  ...bulletList([
    "Perimeter around sensitive projects: BigQuery, GCS, Cloud SQL, Spanner, Artifact Registry",
    "Ingress rules: allow access from approved VPC networks and service accounts",
    "Egress rules: restrict what data can leave the perimeter; monitor violations via Cloud Logging",
    "Dry run mode: test perimeter impact before enforcement. Review violations for 2 weeks before converting to enforced mode."
  ]),
  h3("Cloud Armor and Identity-Aware Proxy"),
  ...bulletList([
    "Cloud Armor: Adaptive Protection for Layer 7 DDoS; OWASP preconfigured rules; rate limiting per IP; geo-restriction for compliance",
    "IAP: replace bastion hosts entirely. Entra ID or Google identity authentication + context-aware access. No VPN required for admin access.",
    "Cloud IDS: out-of-band network threat detection powered by Palo Alto Networks. Detects: malware C2, exploits, lateral movement. Zero latency impact.",
    "Hierarchical Firewall: org-level DENY rules override project-level allows. Use for baseline deny-all inbound policy."
  ]),
  spacer(1)[0],

  h2("4.3 Data Protection"),
  h3("Cloud KMS and CMEK"),
  ...bulletList([
    "CMEK mandatory for: GCS (sensitive buckets), BigQuery datasets, Cloud SQL instances, Spanner, Pub/Sub, GKE (etcd and node boot disk)",
    "Cloud HSM: hardware-backed keys for FIPS 140-2 Level 3 compliance",
    "Key rotation: 90-day rotation policy for symmetric keys; 1-year for asymmetric",
    "Key rings per environment and service: prod-keys, non-prod-keys. Principle of key isolation.",
    "CMEK access audited: cloudkms.cryptoKeyVersions.useToDecrypt logged in Data Access audit logs"
  ]),
  h3("Secret Manager"),
  ...bulletList([
    "Versioned secrets with CMEK encryption; automatic replication to multiple regions",
    "Access via Workload Identity — no service account JSON keys stored anywhere",
    "Secret rotation: Cloud Functions triggered by Pub/Sub notification on secret version create",
    "Audit: secretmanager.versions.access in Cloud Audit Logs; alert on access from unusual service accounts"
  ]),
  h3("Cloud DLP and Assured Workloads"),
  ...bulletList([
    "Cloud DLP: scan GCS, BigQuery, Datastore for 150+ infoTypes (PII, PHI, PCI, government IDs)",
    "De-identification: tokenization, pseudonymization, masking, date shifting for analytics use cases",
    "Findings exported to Security Command Center for posture visibility",
    "Assured Workloads: jurisdiction controls (FedRAMP High, ITAR, CJIS). Enforces CMEK + geo-constraints + personnel controls."
  ]),
  spacer(1)[0],

  h2("4.4 Detection and Response"),
  h3("Security Command Center (SCC)"),
  ...bulletList([
    "Enable SCC Premium at Org level for full threat detection and compliance reporting",
    "Event Threat Detection (ETD): real-time threat detection from Cloud Logging streams. Detects crypto mining, data exfiltration, credential compromise, malware.",
    "Container Threat Detection (CTD): kernel-level detection for GKE workloads. Detects reverse shell, unexpected binary, malicious scripts. Zero agent overhead.",
    "Virtual Machine Threat Detection (VMTD): hypervisor-level memory scanning for rootkits and crypto miners on GCE.",
    "Compliance reports: CIS GCP Foundations, PCI DSS, HIPAA, ISO 27001, NIST SP 800-53 — auto-generated from SCC findings."
  ]),
  h3("Chronicle SIEM"),
  ...bulletList([
    "Cloud-native SIEM built on Google infrastructure; petabyte-scale log ingestion at flat cost",
    "Unified Data Model (UDM): normalize logs from all sources into consistent schema",
    "YARA-L detection rules: write custom detections with temporal correlation across entities",
    "Threat Intelligence: VirusTotal + Google Threat Intelligence + MITRE ATT&CK tagging",
    "Chronicle SOAR: automated playbooks for investigation and response (acquired Siemplify)"
  ]),
  h3("Cloud Audit Logs"),
  ...bulletList([
    "Admin Activity logs: always on; captures all management plane API calls. 400-day retention.",
    "Data Access logs: enable for all services handling sensitive data (GCS, BigQuery, Cloud SQL, Secret Manager). High volume — filter thoughtfully.",
    "Organization Log Sink: aggregate all project logs to centralized BigQuery + GCS in Security project.",
    "Log integrity: enable Cloud Logging bucket with CMEK and locked retention for forensic integrity."
  ]),
  spacer(1)[0],

  h2("4.5 Governance and CSPM"),
  ...bulletList([
    "Resource Hierarchy: Org → Folders (prod, non-prod, shared, sandbox) → Projects. IAM and Org Policy apply at folder level with project inheritance.",
    "Org Policy Service: enforce all critical constraints at Org or folder level. Version-controlled in Terraform with automated apply via Cloud Build.",
    "Policy Intelligence: IAM Recommender + Role Recommender for continuous least-privilege. Firewall Insights for unused rule cleanup. Policy Analyzer for effective access queries.",
    "GitOps with Config Sync (Anthos Config Management): Git repo as source of truth for K8s config. All changes via PR with automated policy validation (OPA Conftest / Gatekeeper).",
    "Terraform with Terraform Validator and gcloud Policy Library: pre-apply policy checks for all GCP resource configurations. Break build on policy violation."
  ]),
  spacer(1)[0]
);

// ─── 5. Advanced Security Domains ────────────────────────────────────────────
children.push(
  h1("5. Advanced Security Domains"),
  para("Beyond foundational cloud-native controls, production environments require dedicated treatment of workload identity, service-to-service trust, secrets lifecycle, data posture, runtime defense, software supply chain integrity, and centralized observability. These domains cut across all three major cloud providers and must be addressed with cross-cutting architecture rather than per-cloud point solutions."),

  h2("5.1 Machine Identity Governance"),
  para("Machine identities — service accounts, workload identities, CI/CD pipelines, Kubernetes pods, and compute instances — now outnumber human identities by an order of magnitude in most enterprise cloud environments. Poor machine identity hygiene is the primary enabler of lateral movement and privilege escalation."),
  ...bulletList([
    "Inventory: maintain a live registry of every machine identity, its trust anchor (OIDC issuer, IAM role, managed identity), owning team, and last-used timestamp. Automate discovery via cloud IAM APIs on a daily schedule.",
    "No static credentials: prohibit long-lived access keys for any machine identity. Use IRSA (AWS), Workload Identity (GCP), and Managed Identities (Azure) exclusively. Enforce with AWS Org Policy (iam:CreateAccessKey deny), GCP Org Policy (iam.disableServiceAccountKeyCreation), and Azure Policy.",
    "Lifecycle management: service accounts must have a defined owner, a documented purpose, and an expiry review date. Decommission immediately on workload retirement. Automate alerts for service accounts unused for 90 days.",
    "Least privilege: machine identity permissions must be bounded to the specific APIs, resources, and conditions required. Use IAM condition keys (aws:RequestedRegion, resource tags) and GCP IAM conditions to scope beyond role level.",
    "Detection: alert on: service account key creation events, cross-account AssumeRole from unusual source IPs, token requests outside expected CIDR, and service account impersonation (GCP)."
  ]),
  spacer(1)[0],

  h2("5.2 Service-to-Service Zero Trust"),
  para("Within and across clusters, services must authenticate each other cryptographically. Implicit network trust (\"anything inside the VPC is trusted\") is a well-documented attack enabler. Service mesh with mutual TLS provides the correct trust model."),
  ...bulletList([
    "SPIFFE/SPIRE: use SPIFFE (Secure Production Identity Framework For Everyone) as the identity standard. Every workload gets a SPIFFE Verifiable Identity Document (SVID) tied to its deployment identity, not its network address.",
    "Service mesh: deploy Istio or Linkerd with strict mTLS mode. All pod-to-pod communication must be encrypted and mutually authenticated. Permissive mode is a migration tool only — never leave in production.",
    "Authorization policy: define Istio AuthorizationPolicy or Linkerd ServiceProfile resources for every service. Specify allowed source principals, HTTP methods, and paths. Default-deny for all unspecified paths.",
    "Egress control: route all outbound traffic through a dedicated egress gateway. No direct internet egress from application pods. Apply egress AuthorizationPolicy to restrict destination hosts.",
    "Readiness assessment: service mesh adds control-plane reliability requirements, certificate rotation complexity, and observability overhead. Assess team readiness before mandating mesh adoption. Phased rollout starting with highest-risk namespaces is appropriate."
  ]),
  spacer(1)[0],

  h2("5.3 Dynamic Secrets Architecture"),
  para("Static secrets — database passwords, API keys, TLS certificates — are a perennial source of breaches. They are shared, rotated infrequently, and accumulate in configuration files, environment variables, and CI/CD pipelines. The correct architecture generates short-lived, scoped credentials on demand and delivers them to workloads without persisting them."),
  ...bulletList([
    "HashiCorp Vault: deploy Vault with cloud-native auto-unseal (AWS KMS, Azure Key Vault, GCP KMS). Use Vault dynamic secrets engines: database (Postgres, MySQL, MSSQL), AWS IAM, Azure, GCP, PKI, and SSH.",
    "Vault Agent / VSO: use Vault Agent sidecar or the Vault Secrets Operator (Kubernetes) to inject secrets into pods as files or environment variables at startup. Never pass secrets via image environment variables baked at build time.",
    "Short TTLs: database credentials should have TTLs of 1–24 hours. PKI certificates for internal services: 24–72 hours. Rotate automatically — no human intervention in the steady state.",
    "Cloud-native alternatives: AWS Secrets Manager with automatic rotation, Azure Key Vault with rotation policies, GCP Secret Manager with version pinning. Use Vault for cross-cloud unification; use cloud-native for cloud-specific workloads where Vault is unavailable.",
    "Audit: all secret accesses must be logged with principal identity, secret path, and timestamp. Use Vault audit log or cloud-native audit trails. Alert on unexpected secret access patterns."
  ]),
  spacer(1)[0],

  h2("5.4 Data Security Posture Management (DSPM)"),
  para("Data sprawl across cloud storage — S3, Azure Blob, GCS, RDS, BigQuery, Snowflake — creates an enormous and largely unmapped sensitive-data footprint. DSPM tools continuously discover, classify, and monitor this footprint, providing the data-layer visibility that CSPM misses."),
  ...bulletList([
    "Discover: automated, continuous scanning of all cloud storage and database services to build a data inventory. Include structured (databases, data warehouses) and unstructured (object storage, file shares) storage.",
    "Classify: apply classification labels (PII, PHI, PCI, confidential, internal, public) using regex, ML classifiers, and custom patterns. Map classifications to regulatory obligations (GDPR, HIPAA, PCI-DSS).",
    "Monitor: alert on data flows that violate classification policies — PII in non-encrypted storage, PHI accessible from non-production accounts, confidential data in public buckets.",
    "Tooling: Wiz DSPM, Varonis, Cyera, BigID, or Microsoft Purview (Azure-native). Integrate DSPM findings into the central CSPM dashboard for unified risk view.",
    "Remediation: DSPM findings must trigger a defined remediation workflow: owner notification, 30-day SLA for critical findings (public PII), 90-day SLA for high findings. Track remediation rate as a security KPI."
  ]),
  spacer(1)[0],

  h2("5.5 Runtime Threat Detection"),
  para("Static controls (IAM policies, network rules, image scanning) prevent known-bad configurations. Runtime detection catches attackers operating within the bounds of what was initially permitted — through compromised workloads, stolen credentials, or novel attack paths not yet encoded in policy."),
  ...bulletList([
    "Log-based detection: cloud provider security services (AWS GuardDuty, Azure Defender for Cloud, GCP Threat Intelligence) analyze control-plane API logs for anomalous patterns — credential exfiltration, unusual cross-region activity, API calls from Tor exit nodes.",
    "Kernel-level detection: Falco (CNCF) provides real-time syscall inspection for containers. Rules detect: container escape attempts, shell spawning in production pods, unexpected binary execution, sensitive file reads (/etc/shadow, cloud credential files).",
    "UEBA: User and Entity Behavior Analytics identifies deviations from established behavioral baselines — a service account that suddenly calls List/Get across all S3 buckets, or a principal logging in from an anomalous geography.",
    "Alert fidelity: tune detection rules to reduce false positive rate below 5% for critical alerts. High false-positive rates cause alert fatigue and missed real incidents. Maintain tuning log with rationale for each suppression.",
    "Response automation: wire GuardDuty/Defender/SCC findings to SOAR playbooks for automated response: isolate compromised instance, revoke credentials, snapshot disk for forensics. Human review required before permanent action."
  ]),
  spacer(1)[0],

  h2("5.6 Software Supply Chain Security"),
  para("The supply chain attack surface spans source code, dependencies, build pipelines, container registries, and deployment infrastructure. Compromise at any stage propagates to production. A defense-in-depth supply chain strategy addresses each stage independently."),
  ...bulletList([
    "Source integrity: branch protection on all production branches (required PR reviews, signed commits via Gitleaks or GPG, no force-push). Secrets scanning pre-commit (git-secrets, Gitleaks) and in CI.",
    "Dependency management: software composition analysis (SCA) on every pull request — Snyk, Dependabot, or OWASP Dependency-Check. Block merge on critical CVEs. Pin dependency versions and review dependency updates via automated PRs.",
    "Build pipeline hardening: CI/CD runners must be ephemeral (no persistent state between builds). Secrets injected via OIDC token exchange, not static secrets. Builds must be hermetic and reproducible. Sign all build artifacts.",
    "Artifact signing and verification: sign container images and binaries with Sigstore/Cosign using OIDC-based keyless signing. Verify signatures at deploy time via admission controller (Kyverno, Gatekeeper, or OPA). Reject unsigned or unverified images.",
    "SBOM: generate a Software Bill of Materials (SBOM) in CycloneDX or SPDX format for every production build. Ingest SBOMs into a vulnerability management platform for continuous monitoring against new CVEs.",
    "SLSA Framework: target SLSA Level 3 for all production services. Level 3 requires: version-controlled build definitions, isolated build environment, signed provenance, and two-party review. SLSA Level 1 (any provenance) is the minimum acceptable baseline."
  ]),
  spacer(1)[0],

  h2("5.7 Centralized Identity and Logging Architecture"),
  para("Effective security operations depend on a consistent identity plane and a complete, tamper-evident log record spanning all cloud providers. Fragmented identity and siloed logs are the two most common reasons that incidents go undetected or uninvestigated."),

  h3("Identity Federation Architecture"),
  para("A single authoritative Identity Provider (IdP) must federate to all cloud IAM systems. This eliminates per-cloud identity silos, enforces consistent authentication policy, and provides a unified audit trail for all human and workload access."),
  ...bulletList([
    "Central IdP: Microsoft Entra ID or Okta serves as the authoritative identity store. All human identities are provisioned and deprovisioned through the IdP. SCIM 2.0 provisioning to all cloud directories.",
    "AWS federation: SAML 2.0 or OIDC to IAM Identity Center (AWS SSO). Users receive permission sets mapped to IAM roles — no direct IAM user accounts in any AWS account.",
    "Azure federation: Entra ID is native. All external identities (contractors, partners) must federate through Entra ID B2B — no local Azure AD accounts.",
    "GCP federation: SAML federation from Entra ID or Okta to Cloud Identity. Cloud Identity handles GCP IAM group membership. Google Workspace for GCP-native teams.",
    "Workload identity federation: AWS IRSA and EKS Pod Identity, GCP Workload Identity, Azure Managed Identity. Cross-cloud token exchange (AWS STS → GCP STS) for multi-cloud workloads. No static credentials in any cross-cloud integration."
  ]),
  spacer(1)[0],

  h3("Centralized SIEM and Log Aggregation"),
  para("All security-relevant logs must flow to a centralized SIEM with defined retention, normalization, and detection rule coverage. Partial log coverage is operationally equivalent to no coverage for the events that are missing."),
  ...bulletList([
    "Log sources — AWS: CloudTrail (all regions, all accounts via Org Trail), VPC Flow Logs, GuardDuty findings, Config events, EKS audit logs, WAF logs. Route via Kinesis Firehose or S3 → SIEM connector.",
    "Log sources — Azure: Entra ID sign-in and audit logs, Activity Log, Defender for Cloud alerts, NSG Flow Logs, AKS audit logs. Route via Diagnostic Settings → Event Hub → SIEM connector.",
    "Log sources — GCP: Cloud Audit Logs (Admin Activity, Data Access), VPC Flow Logs, SCC findings, GKE audit logs. Route via Log Router sink → Pub/Sub → SIEM connector.",
    "SIEM platform: Microsoft Sentinel (native multi-cloud connectors, UEBA, SOAR integration) or Chronicle SIEM (Google, excellent GCP integration, petabyte-scale ingestion). Both support YARA-L and KQL detection respectively.",
    "Log retention: hot tier (queryable) 90 days minimum; cold tier (archived, restorable within 24h) 12 months minimum; legal hold tier (immutable) per regulatory requirement (HIPAA: 6 years, PCI: 12 months, GDPR: purpose-limited).",
    "Normalization: normalize all log sources to a common schema (OCSF or Elastic Common Schema) before ingestion. Non-normalized logs make cross-source correlation unreliable.",
    "Log integrity: enable immutable log storage (S3 Object Lock, Azure Blob WORM, GCS Bucket Lock). Logs must be tamper-evident — hash-chain or cloud-native log integrity features must be enabled for all forensically-relevant sources."
  ]),
  spacer(1)[0]
);

// ─── 6. Multi-Cloud Zero Trust ────────────────────────────────────────────────
children.push(
  h1("6. Multi-Cloud Zero Trust Architecture"),
  para("Operating across AWS, Azure, and GCP requires a unified Zero Trust architecture that bridges cloud-native identity systems, establishes consistent network isolation, and centralizes detection. The four pillars of multi-cloud Zero Trust are:"),

  h2("6.1 Unified Identity"),
  para("A single Identity Provider federates to all three cloud IAM systems. This ensures consistent authentication policies (MFA, Conditional Access) and a single audit trail."),
  ...bulletList([
    "Central IdP: Microsoft Entra ID or Okta. All human identities authenticate through the central IdP.",
    "AWS: SAML 2.0 or OIDC federation to IAM Identity Center (AWS SSO). Users get permission sets, not direct IAM roles.",
    "Azure: Entra ID is native. Ensure all external identities also federate through central IdP.",
    "GCP: Google Workspace with Cloud Identity, or SAML federation from Entra ID / Okta to Cloud Identity.",
    "Workload-to-workload: Use OIDC/SAML token exchange between cloud boundaries (AWS → GCP via Workload Identity Federation)."
  ]),
  spacer(1)[0],

  h2("6.2 Workload Identity Cross-Cloud"),
  ...bulletList([
    "AWS → GCP: AWS EC2/EKS workloads use IRSA/Instance Profile to get AWS STS token; exchange for GCP Workload Identity token via federation.",
    "GitHub Actions → All clouds: OIDC token from GitHub Actions federated to all three clouds. No static credentials in GitHub Secrets.",
    "Vault (HashiCorp): deploy Vault with cloud-native auto-unseal (AWS KMS / Azure Key Vault / GCP KMS). Vault handles secret lifecycle across all providers.",
    "No shared secrets between clouds: each cloud-to-cloud trust relationship uses token federation, not static keys."
  ]),
  spacer(1)[0],

  h2("6.3 Private Cross-Cloud Connectivity"),
  ...bulletList([
    "AWS ↔ Azure: Azure ExpressRoute + AWS Direct Connect via transit provider (Equinix). Or Aviatrix multi-cloud networking for BGP-based routing.",
    "AWS ↔ GCP: Partner Interconnect + Direct Connect via carrier. No site-to-site VPN over public internet for production traffic.",
    "GCP ↔ Azure: Azure ExpressRoute + GCP Dedicated Interconnect via co-location facility.",
    "Zero trust overlay: Aviatrix or Illumio for microsegmentation and encrypted east-west traffic across cloud boundaries.",
    "DNS: centralized private DNS resolution with forwarding zones per provider. No public DNS for internal service communication."
  ]),
  spacer(1)[0],

  h2("6.4 Multi-Cloud Security Operations Stack"),
  spacer(1)[0],
  twoColTable("Layer", "Tools / Approach", [
    ["CSPM", "Wiz / Prisma Cloud (multi-cloud) or: Security Hub (AWS) + Defender for Cloud (Azure) + SCC (GCP) with unified reporting"],
    ["SIEM", "Microsoft Sentinel (native multi-cloud connectors) or Chronicle SIEM + log export from all providers"],
    ["Secrets", "HashiCorp Vault Enterprise (multi-cloud) or per-cloud native: Secrets Manager / Key Vault / Secret Manager"],
    ["IaC + Policy", "Terraform + Checkov or OPA Conftest for policy-as-code validation pre-deployment"],
    ["IdP", "Entra ID or Okta federating to IAM Identity Center, Cloud Identity, Azure AD"],
    ["Network", "Aviatrix Controller / AWS Transit Gateway / Azure Virtual WAN / GCP NCC for unified routing"],
    ["EDR", "Microsoft Defender for Endpoint across all cloud VMs and containers"],
  ], 1600, 7760),
  spacer(1)[0]
);

// ─── 7. MITRE ATT&CK Cloud ───────────────────────────────────────────────────
children.push(
  h1("7. MITRE ATT&CK for Cloud Techniques"),
  para("The following table maps key MITRE ATT&CK for Cloud techniques to their descriptions, affected providers, and recommended mitigations. These techniques represent the primary attack vectors in cloud environments."),
  spacer(1)[0],

  new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [1000, 1800, 1300, 2500, 2760],
    rows: [
      new TableRow({
        children: ["Technique", "Name", "Tactic", "Description", "Mitigation"].map(h => new TableCell({
          shading: { fill: RED, type: ShadingType.CLEAR }, borders: allBorders,
          width: { size: h==="Technique"?1000:h==="Name"?1800:h==="Tactic"?1300:h==="Description"?2500:2760, type: DXA },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })] })]
        }))
      }),
      ...([
        ["T1078.004", "Valid Accounts: Cloud", "Initial Access / Persistence", "Compromised cloud IAM credentials used for unauthorized access and lateral movement.", "MFA everywhere; GuardDuty credential anomaly detection; alert on console logins without MFA; rotate all access keys."],
        ["T1530", "Data from Cloud Storage", "Collection", "Sensitive data exfiltrated from GCS, S3, Azure Blob via overly-permissive IAM roles.", "VPC Service Controls; S3 Block Public Access; private endpoints only; Macie/DLP scanning."],
        ["T1537", "Transfer to Cloud Account", "Exfiltration", "Data copied to attacker-controlled cloud storage across trust boundaries.", "S3 bucket policies with aws:PrincipalOrgID; DLP monitoring; CloudTrail data events on sensitive buckets."],
        ["T1098.001", "Additional Cloud Credentials", "Persistence", "Attacker creates access keys or OAuth app credentials to maintain persistence.", "Org Policy: disable SA key creation; Access Analyzer unused access alerts; audit iam:CreateAccessKey events."],
        ["T1190", "Exploit Public-Facing App", "Initial Access", "Vulnerability exploitation in internet-exposed cloud workloads (web apps, APIs, containers).", "WAF (AWS WAF / Cloud Armor / Azure WAF); private-by-default; Inspector/Defender scanning."],
        ["T1552.005", "Cloud Instance Metadata", "Credential Access", "SSRF or malicious code queries IMDS for IAM credentials via 169.254.169.254.", "IMDSv2 required (AWS); block IMDS from containers; SSRF protections in WAF; network policy to block metadata access."],
        ["T1136.003", "Cloud Account Creation", "Persistence", "New IAM users or service accounts created as persistent backdoors post-compromise.", "SCP: deny iam:CreateUser; alert on CreateServiceAccount; Org Policy: iam.disableServiceAccountKeyCreation."],
        ["T1580", "Cloud Infrastructure Discovery", "Discovery", "Enumeration of cloud resources, IAM policies, and roles to identify privilege escalation paths.", "Deny DescribeIamRole/List without conditions; Access Analyzer unused access; GuardDuty IAM anomaly alerts."],
        ["T1619", "Cloud Storage Object Discovery", "Discovery", "Listing S3/GCS/Blob objects to find sensitive data for collection.", "Disable public listing; CloudTrail data events on s3:ListBucket; abnormal List call volume alerts in GuardDuty/SCC."],
      ].map((row, ri) => {
        const bg = ri % 2 === 0 ? LTGRAY : WHITE;
        const widths = [1000, 1800, 1300, 2500, 2760];
        return new TableRow({ children: row.map((val, ci) => new TableCell({
          shading: { fill: bg, type: ShadingType.CLEAR }, borders: allBorders,
          width: { size: widths[ci], type: DXA },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: val, font: "Calibri", size: 17, bold: ci===0, color: ci===0?RED:DARKGRAY })] })]
        })) });
      }))
    ]
  }),
  spacer(1)[0]
);

// ─── 8. NIST SP 800-53 Mapping ────────────────────────────────────────────────
children.push(
  h1("8. NIST SP 800-53 Rev 5 Control Mapping"),
  para("The table below maps key NIST SP 800-53 Rev 5 controls to native services in each cloud provider. This mapping supports compliance reporting, security assessments, and System Security Plan (SSP) documentation."),
  spacer(1)[0],

  new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [720, 1360, 2560, 2360, 2360],
    rows: [
      new TableRow({
        children: ["Control", "Name", "AWS", "Azure", "GCP"].map((h, ci) => new TableCell({
          shading: { fill: GREEN, type: ShadingType.CLEAR }, borders: allBorders,
          width: { size: [720,1360,2560,2360,2360][ci], type: DXA },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })] })]
        }))
      }),
      ...([
        ["AC-2", "Account Mgmt", "IAM Identity Center + Access Analyzer + Access Advisor", "Entra ID + PIM access reviews + Lifecycle Workflows", "IAM Recommender + Policy Analyzer + workforce pools"],
        ["AC-3", "Access Enforcement", "SCPs + Permission Boundaries + S3 Bucket Policies + resource policies", "Azure RBAC + Conditional Access + Azure AD App Roles", "IAM Conditions + VPC Service Controls + Org Policy"],
        ["AC-17", "Remote Access", "SSM Session Manager (no SSH); AWS Systems Manager + CloudWatch agent", "Azure Bastion + Just-In-Time VM access (Defender for Cloud)", "IAP Tunneling + BeyondCorp Enterprise + OS Login"],
        ["AU-2", "Event Logging", "CloudTrail (org trail) + VPC Flow Logs + ELB access logs + Lambda logs", "Azure Activity Log + NSG Flow Logs + Diagnostic Settings → Log Analytics", "Cloud Audit Logs (Admin Activity + Data Access) + VPC Flow Logs"],
        ["AU-9", "Audit Protection", "CloudTrail log file validation + S3 Object Lock (WORM) + S3 MFA Delete", "Storage Account immutability + Sentinel log retention policy", "Cloud Logging bucket with locked retention + Assured Workloads"],
        ["IA-5", "Auth Management", "Secrets Manager (auto-rotation) + IAM; no static access keys policy via SCP", "Key Vault + Managed Identity (no client secrets); Entra ID auth only", "Secret Manager (versioned, CMEK) + Workload Identity; no SA keys via Org Policy"],
        ["SC-7", "Boundary Protection", "VPC + SGs + NACLs + AWS WAF + Network Firewall + PrivateLink", "NSG + Azure Firewall Premium + Application Gateway WAF + Private Endpoints", "Hierarchical Firewall + Cloud Armor + Cloud IDS + VPC Service Controls"],
        ["SC-8", "Transmission Integrity", "TLS 1.2+ enforced on ALBs + CloudFront; S3 enforce-https bucket policy", "TLS minimum version policy on App Service, Storage, SQL via Azure Policy", "HTTPS enforced via Org Policy + Cloud Load Balancer SSL policies"],
        ["SC-28", "At-Rest Protection", "KMS CMKs on EBS, S3, RDS, DynamoDB, Lambda, Redshift, OpenSearch", "Key Vault CMK on Storage, SQL, ADE (disk), AKS, Cosmos DB, Azure Monitor", "Cloud KMS CMEK on GCS, BigQuery, Cloud SQL, Spanner, GKE (etcd + nodes)"],
        ["SI-3", "Malicious Code Prot.", "GuardDuty Malware Protection + Inspector + Macie + ECR image scanning", "Defender for Cloud (all Plans) + Defender for Endpoint + Defender for Containers", "SCC ETD + CTD + VMTD + Artifact Registry vulnerability scanning"],
      ].map((row, ri) => {
        const bg = ri % 2 === 0 ? LTGRAY : WHITE;
        const widths = [720,1360,2560,2360,2360];
        return new TableRow({ children: row.map((val, ci) => new TableCell({
          shading: { fill: bg, type: ShadingType.CLEAR }, borders: allBorders,
          width: { size: widths[ci], type: DXA },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: val, font: "Calibri", size: 17, bold: ci===0, color: ci===0?GREEN:DARKGRAY })] })]
        })) });
      }))
    ]
  }),
  spacer(1)[0]
);

// ─── 9. Implementation Roadmap ────────────────────────────────────────────────
children.push(
  h1("9. Implementation Roadmap"),
  para("The following phased roadmap prioritizes foundational controls first, then identity modernization, then prevention, and finally advanced detection maturity. Timing is indicative — adjust based on organizational size and existing baseline."),
  spacer(1)[0],

  h2("Phase 1: Foundations (0–30 Days)"),
  noteBox("Goal: Achieve basic visibility and prevent the most common initial access techniques before any other work.", RED),
  spacer(1)[0],
  ...bulletList([
    "Enable CloudTrail (org trail) / Azure Activity Log / Cloud Audit Logs on all accounts and projects",
    "Enable GuardDuty / Microsoft Defender for Cloud (all plans) / Security Command Center Premium",
    "Block all public access on storage (S3 Block Public Access / Azure storage public access / GCS uniform bucket access)",
    "Enforce MFA for all human identities across all cloud consoles and IdPs — no exceptions",
    "Rotate or disable all long-lived IAM access keys; disable root account programmatic access (AWS); disable default SA keys (GCP)",
    "Enable CloudTrail data events on sensitive S3 buckets; Data Access logs on sensitive GCS/BigQuery",
    "Audit and remove all direct Internet Gateway routes on non-DMZ VPCs/VNets",
  ]),
  spacer(1)[0],

  h2("Phase 2: Identity and Network Hardening (30–90 Days)"),
  noteBox("Goal: Eliminate long-lived credentials and enforce private connectivity for all services.", AMBER),
  spacer(1)[0],
  ...bulletList([
    "Migrate all workloads to Managed Identity / IRSA / Workload Identity Federation — eliminate static keys",
    "Implement Private Endpoints for all PaaS services (Key Vault, Storage, SQL, Service Bus, GCS, BigQuery APIs)",
    "Deploy CSPM platform: Wiz or native (Security Hub FSBP / Defender for Cloud / SCC CIS benchmark)",
    "Enable CMEK for all data stores: KMS CMKs (AWS), Key Vault CMK (Azure), Cloud KMS CMEK (GCP)",
    "Establish centralized SIEM: Sentinel or Chronicle with all cloud log sources ingested",
    "Deploy SCPs / Azure Policy Deny assignments / Org Policy constraints for baseline guardrails",
    "Implement PIM for all privileged roles (Azure); JIT access for production break-glass (all clouds)",
  ]),
  spacer(1)[0],

  h2("Phase 3: Prevention Maturity (90–180 Days)"),
  noteBox("Goal: Shift from detective to preventive posture. Enforce controls at deploy time.", GCP_BLU),
  spacer(1)[0],
  ...bulletList([
    "Complete SCP / Azure Policy / Org Policy guardrail baseline covering all NIST AC/SC/AU controls",
    "Onboard all infrastructure to Terraform with Checkov or OPA Conftest policy-as-code scanning in CI/CD",
    "Conduct first cloud penetration test per provider; remediate all Critical and High findings within 30 days",
    "Automate remediation for critical Config Rule violations (AWS SSM Automation / Azure Policy remediation tasks / GCP Config Controller)",
    "Implement VPC Service Controls perimeter (GCP) around sensitive projects",
    "Deploy AWS Network Firewall / Azure Firewall Premium / Cloud IDS for deep packet inspection and IDPS",
  ]),
  spacer(1)[0],

  h2("Phase 4: Detection Maturity and Continuous Compliance (180 Days+)"),
  noteBox("Goal: Detection-as-code, adversary simulation, and automated compliance reporting.", GREEN),
  spacer(1)[0],
  ...bulletList([
    "Write detection-as-code: YARA-L rules (Chronicle), KQL analytics (Sentinel), custom Config Rules / SCC ETD rules",
    "Integrate multi-cloud SIEM with Threat Intelligence (MITRE ATT&CK Navigator mapping per cloud)",
    "RBAC maturity: right-size all roles using IAM Recommender (GCP) / Access Advisor (AWS) / PIM reviews (Azure)",
    "Continuous compliance reporting: CIS Benchmark, NIST SP 800-53, PCI DSS, HIPAA — scheduled and automated",
    "Red team exercises: cloud-specific attack scenarios using MITRE ATT&CK Cloud matrix (credential theft, metadata SSRF, data exfiltration)",
    "DR/BCP: test cloud backup restores quarterly; run game-day incident response exercises across all providers",
  ]),
  spacer(1)[0],

  h2("Key Success Metrics"),
  twoColTable("Metric", "Target", [
    ["MFA coverage", "100% of human identities across all clouds"],
    ["Long-lived credentials", "Zero IAM access keys / SA keys in production"],
    ["CSPM Secure Score (AWS/Azure/GCP)", "> 90% on all production environments"],
    ["Mean Time to Detect (MTTD)", "< 15 minutes for critical severity findings"],
    ["Mean Time to Respond (MTTR)", "< 4 hours for critical severity findings"],
    ["CMK coverage", "100% of data stores with customer-managed keys"],
    ["Private endpoint coverage", "100% of PaaS services on private endpoints"],
    ["IaC coverage", "> 95% of production infrastructure managed via Terraform"],
    ["Patch SLA (Critical CVE)", "< 48 hours for Critical; < 7 days for High severity"],
  ], 3200, 6160),
  spacer(1)[0],

  // ─── Section 10: AI Security ───────────────────────────────────────────────
  h1("10. AI Security and LLM Governance"),
  para("Artificial intelligence systems introduce new attack surfaces including prompt injection, data leakage, model manipulation, and training data poisoning. Organizations deploying AI services — including large language models (LLMs), ML inference endpoints, and AI-powered features — must implement dedicated security controls."),
  para("Key controls:"),
  ...bulletList([
    "Strict access control for AI model APIs: authentication, rate limiting, and input/output logging",
    "Prompt injection detection and filtering: validate and sanitize all user-supplied inputs before sending to LLM",
    "Monitoring of model outputs for sensitive data exposure (PII, credentials, system prompt leakage)",
    "Red-team testing of AI systems for adversarial prompts, jailbreaking, and indirect prompt injection",
    "Data isolation: ensure fine-tuning and RAG data pipelines cannot exfiltrate sensitive training data",
    "Least-privilege access for AI agents: restrict tool use and external actions to minimum required scope",
  ]),
  para("Recommended frameworks:"),
  ...bulletList([
    "OWASP Top 10 for LLM Applications: LLM01 Prompt Injection through LLM10 Model Theft",
    "NIST AI Risk Management Framework (AI RMF 1.0): Govern, Map, Measure, Manage",
    "MITRE ATLAS: adversarial threat landscape for AI systems",
  ]),
  noteBox("Outcome: AI capabilities are deployed with security guardrails that mitigate emerging AI-specific threats while enabling productive use of AI services.", AMBER),
  spacer(1)[0],

  // ─── Section 11: Attack Path Analysis ─────────────────────────────────────
  h1("11. Cloud Attack Path Analysis"),
  para("Individual security controls and misconfiguration findings do not always reveal the full impact of an attack. A single exposed credential, overly permissive role, or misconfigured resource may be exploitable only when combined with other weaknesses in a chain. Attack path analysis identifies these exploitable privilege escalation chains across identities, resources, and permissions in cloud environments."),
  para("Controls:"),
  ...bulletList([
    "Graph-based identity relationship analysis: map trust relationships between roles, service accounts, and resources",
    "Detection of privilege escalation paths: identify chains where a low-privilege identity can reach high-privilege resources",
    "Visualization of lateral movement opportunities across accounts and cloud boundaries",
    "Prioritization by exploitability: distinguish theoretical misconfiguration from actively exploitable attack paths",
    "Continuous re-evaluation as identity bindings, permissions, and resource configurations change",
  ]),
  para("Example technologies:"),
  ...bulletList([
    "Wiz Security Graph: graph-based attack path analysis across AWS, Azure, GCP, Kubernetes",
    "Microsoft Defender for Cloud attack path analysis (built into Defender CSPM Premium)",
    "BloodHound Enterprise: identity attack paths including cloud IAM and hybrid AD/Azure environments",
    "IAM Access Analyzer (AWS): automated detection of privilege escalation paths within AWS IAM",
  ]),
  noteBox("Outcome: Security teams gain visibility into realistic, exploitable attack chains rather than isolated configuration issues. Remediation effort is focused on the paths that matter.", NAVY),
  spacer(1)[0],

  // ─── Section 12: Operational Security Metrics ────────────────────────────
  h1("12. Operational Security Metrics"),
  para("Security programs that cannot be measured cannot be managed. The following metrics provide a baseline for evaluating the operational health of a cloud security architecture. Metrics should be tracked continuously, reviewed at least monthly, and tied to defined remediation SLAs."),
  spacer(1)[0],

  h2("12.1 Identity and Access"),
  new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: ["Metric","Target","Notes"].map((h, ci) => new TableCell({ shading: { fill: NAVY, type: ShadingType.CLEAR }, borders: allBorders, width: { size: 3120, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 19, bold: true, color: WHITE })] })] })) }),
      ...["Human accounts with MFA enforced,100%,Zero exceptions for interactive accounts",
          "Service accounts with static long-lived credentials,0%,All replaced by workload identity or short-lived tokens",
          "IAM roles with wildcard (*) actions in production,0%,Exception process required for any deviations",
          "Privileged access reviews completed on schedule,100%,Quarterly at minimum for all privileged roles",
          "Mean time to revoke departed user access,< 4 hours,Automated off-boarding triggers preferred"
        ].map((rowStr, ri) => {
          const [metric, target, notes] = rowStr.split(",");
          const bg = ri % 2 === 0 ? LTGRAY : WHITE;
          return new TableRow({ children: [metric, target, notes].map((v, ci) => new TableCell({ shading: { fill: bg, type: ShadingType.CLEAR }, borders: allBorders, width: { size: 3120, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: v, font: "Calibri", size: 18, bold: ci===0, color: DARKGRAY })] })] })) });
        })
    ]
  }),
  spacer(1)[0],

  h2("12.2 Detection and Response"),
  new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: ["Metric","Target","Notes"].map((h, ci) => new TableCell({ shading: { fill: NAVY, type: ShadingType.CLEAR }, borders: allBorders, width: { size: 3120, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 19, bold: true, color: WHITE })] })] })) }),
      ...["Critical findings in CSPM unresolved > 7 days,0%,Auto-remediation preferred for common misconfigs",
          "High-severity SIEM alerts with no triage action,0%,Triage SLA: 4 hours for high severity",
          "Mean time to detect (MTTD) cloud security incidents,< 1 hour,Measured from first signal to alert",
          "Mean time to respond (MTTR) to critical incidents,< 4 hours,Measured from alert to containment",
          "Audit log coverage across all accounts and regions,100%,CloudTrail / Diagnostic Settings / Cloud Audit Logs enabled"
        ].map((rowStr, ri) => {
          const [metric, target, notes] = rowStr.split(",");
          const bg = ri % 2 === 0 ? LTGRAY : WHITE;
          return new TableRow({ children: [metric, target, notes].map((v, ci) => new TableCell({ shading: { fill: bg, type: ShadingType.CLEAR }, borders: allBorders, width: { size: 3120, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: v, font: "Calibri", size: 18, bold: ci===0, color: DARKGRAY })] })] })) });
        })
    ]
  }),
  spacer(1)[0],

  h2("12.3 Data Protection and Posture"),
  new Table({
    width: { size: PAGE_W, type: DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: ["Metric","Target","Notes"].map((h, ci) => new TableCell({ shading: { fill: NAVY, type: ShadingType.CLEAR }, borders: allBorders, width: { size: 3120, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 19, bold: true, color: WHITE })] })] })) }),
      ...["Publicly accessible storage buckets,0%,S3 Block Public Access / GCS Uniform Bucket-Level Access / Azure Defender",
          "Sensitive data stores without encryption at rest,0%,Enforced via policy guardrails",
          "Secrets found in code repositories or container images,0%,Secret scanning enabled in CI and repo platform",
          "CMK rotation compliance (annual or per policy),100%,Automated rotation enforced via KMS policy",
          "DSPM scan coverage over production data stores,> 95%,Remaining 5% documented with compensating controls"
        ].map((rowStr, ri) => {
          const [metric, target, notes] = rowStr.split(",");
          const bg = ri % 2 === 0 ? LTGRAY : WHITE;
          return new TableRow({ children: [metric, target, notes].map((v, ci) => new TableCell({ shading: { fill: bg, type: ShadingType.CLEAR }, borders: allBorders, width: { size: 3120, type: DXA }, margins: { top:60,bottom:60,left:100,right:100 }, children: [new Paragraph({ children: [new TextRun({ text: v, font: "Calibri", size: 18, bold: ci===0, color: DARKGRAY })] })] })) });
        })
    ]
  }),
  spacer(1)[0],

  h2("12.4 Supply Chain and Build Integrity"),
  ...bulletList([
    "Build pipeline SLSA Level: Target Level 3 for all production artifacts. Measure percentage of pipelines meeting this bar.",
    "Artifact signature verification: 100% of container images verified via Cosign or equivalent before deployment to production.",
    "Dependency vulnerability scan pass rate: Critical and high vulnerabilities in dependencies must be resolved before production promotion.",
    "IaC policy scan pass rate: 100% of infrastructure-as-code changes scanned against security policy before merge.",
    "SBOM generation coverage: 100% of production services generating machine-readable SBOM per build.",
  ]),
  noteBox("Metrics without ownership are decorative. Assign a named owner per metric, define remediation SLAs, and integrate metrics into security reviews and quarterly reporting.", AMBER),
  spacer(1)[0],

  // ─── Key Takeaways ────────────────────────────────────────────────────────
  h1("Key Takeaways"),
  para("Cloud security is not a configuration checklist. It is an engineering discipline requiring continuous architecture decisions, operational ownership, and measurement. The following principles synthesize the guidance in this document."),
  spacer(1)[0],
  ...bulletList([
    "Identity is the perimeter. Every access decision in cloud must be mediated by a verified, least-privileged identity — human or machine. MFA without exception, no static credentials, and continuous access reviews are non-negotiable baselines.",
    "Least privilege requires active maintenance. Permissions accumulate. IAM posture degrades over time without automated analysis and remediation. Treat permissive IAM as a critical finding, not a configuration debt item.",
    "Static controls are necessary but insufficient. Misconfigurations get through, zero-days happen, and insider threats operate within allowed permissions. Runtime detection, behavioral analytics, and incident response capability are required complements to preventive controls.",
    "Supply chain is the new perimeter. A secure runtime means nothing if the artifact running in it was compromised before deployment. SCA, artifact signing, SBOM, and SLSA Level 3 are not advanced practices — they are the minimum bar for production workloads.",
    "Complexity is a security liability. Controls too complex to operate consistently create their own risk surface. Mandate only what the organization can sustainably run. Operational sustainability is a security requirement, not an excuse.",
    "Centralized visibility is not optional. Siloed logs and fragmented identity planes make incident detection and response operationally impossible at scale. Invest in centralized SIEM, normalized log schemas, and a single authoritative IdP before adding more point solutions.",
    "Measure what you intend to improve. Adopt the metrics framework in Section 12. Assign owners. Define remediation SLAs. Review monthly. Security posture without measurement is theatre.",
    "Architecture must match your operational maturity. Service mesh, DSPM, and attack path analysis are powerful tools — and expensive failures if deployed without the team capability to operate them. Assess maturity honestly. Phase implementations accordingly."
  ]),
  spacer(1)[0],
  noteBox("The controls in this document represent a mature target state. Not every organization will implement every control on day one. What matters is that gaps are known, owned, and tracked on a risk-informed roadmap — not discovered during an incident.", AMBER),
  spacer(1)[0],

  // ─── Attribution ──────────────────────────────────────────────────────────
  new Paragraph({
    pageBreakBefore: true,
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: AMBER, space: 1 } },
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text: "Usage, License & Attribution", font: "Arial", size: 28, bold: true, color: NAVY })]
  }),
  para("This document is freely available for use, adaptation, and redistribution under the following terms:"),
  ...bulletList([
    "You may use this document for personal, educational, or commercial purposes.",
    "You may modify, extend, and build upon this work.",
    "You may redistribute original or modified versions.",
    "Required: Proper credit must be given to the original author in any use, distribution, or derivative work."
  ]),
  spacer(1)[0],
  para("Author: Eran Shpigelman", { bold: true }),
  para("Contact: eransh10@gmail.com"),
  spacer(1)[0],
  para("Attribution should appear in the document, presentation, or wherever the work is shared — a note such as: \"Based on work by Eran Shpigelman (eransh10@gmail.com)\" is sufficient.", { italic: true, color: MIDGRAY }),
);

// ─── Build document ──────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 260 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: CLOUD },
        paragraph: { spacing: { before: 260, after: 160 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: DARKGRAY },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 1 } },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Cloud Security Architecture  |  AWS  ·  Azure  ·  GCP", font: "Calibri", size: 18, color: MIDGRAY }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 1 } },
          spacing: { before: 80 },
          children: [
            new TextRun({ text: "Eran Shpigelman  ·  eransh10@gmail.com", font: "Calibri", size: 18, color: MIDGRAY }),
            new TextRun({ text: "\t", font: "Calibri", size: 18 }),
            new TextRun({ text: "Page ", font: "Calibri", size: 18, color: MIDGRAY }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 18, color: MIDGRAY }),
          ]
        })]
      })
    },
    children
  }]
});

const outPath = "/sessions/trusting-sleepy-archimedes/cloud_security_architecture.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log(`Done: ${outPath}`);
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
