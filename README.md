# Security Architecture Guidelines & Best Practices

A curated collection of security architecture guidelines, reference documents, and best practices across key technology domains. This repository serves as a living resource for architects, engineers, and security practitioners.

## Repository Structure

```
├── kubernetes/        # Kubernetes & container security architecture
├── ai-ml/             # AI/LLM security architecture & threat modeling
```

## Topics Covered

### Kubernetes Security (`/kubernetes`)
| File | Description |
|------|-------------|
| `k8s_security_architecture.docx` | Comprehensive Kubernetes security architecture reference |
| `kubernetes_architecture_v2.docx` | Kubernetes architecture guidelines v2 |
| `kubernetes_architecture_deck_v2_1.pptx` | Kubernetes security architecture presentation deck |

### AI / LLM Security (`/ai-ml`)
| File | Description |
|------|-------------|
| `gpt_architecture.docx` | GPT/LLM security architecture reference |
| `gpt_architecture_deck.pptx` | GPT security architecture presentation deck |

## Roadmap: Planned Coverage Areas

The following domains are planned for future additions:

- **Network Security** . Zero trust, segmentation, perimeter controls
- **Cloud Security** . AWS, Azure, GCP architecture patterns
- **Identity & Access Management** . AuthN/AuthZ, SSO, PAM
- **Data Security** . Encryption, DLP, data classification
- **Application Security** . Secure SDLC, API security, SAST/DAST
- **Incident Response** . Playbooks, detection patterns, forensics
- **Supply Chain Security** . SBOM, dependency management, CI/CD hardening

## Contributing

To add content, follow this structure:
1. Place docs in the relevant topic folder (or create a new one if the topic doesn't exist)
2. Keep naming consistent: `{topic}_{type}.docx/.pptx`
3. Update this README with the new entry

## Purpose

Generic, vendor-neutral security architecture guidance applicable across organizations and environments. Not tied to any specific product or toolchain.
