# Feature — Multi-cloud

> Part: [Learning track](../learning-track.md) · Epics: L-11

## Purpose

Optional exercise: move one service (Export or AI Generation) to AWS to learn a second cloud with the same Terraform and Kubernetes skills.

## Design notes

- Terraform AWS provider: EKS (or a single-node alternative to save cost), RDS if needed, secrets manager; cross-cloud networking via public endpoints + mTLS first; compare costs and operations.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-11](epics/L-11-aws-migration-exercise.md) | **AWS migration exercise** | Terraform for EKS/RDS, move one service, cross-cloud secrets and networking, cost comparison write-up. | P-13 | 7 |
