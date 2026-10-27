# Feature — Kubernetes

> Part: [Learning track](../learning-track.md) · Epics: L-08, L-10

## Purpose

Run the whole platform on Kubernetes, locally first (D-09): Helm charts for every service, autoscaling of AI workers, GitOps, network policies, and cost control for the later AKS deployment. Preview hosting builds on it.

## Design notes

- kind or k3d cluster scripts; the same images as Aspire; Helm chart per service plus an umbrella chart; secrets via sealed-secrets locally and Key Vault CSI in AKS.
- KEDA scaler on Kafka lag (batch regeneration) and HPA on gRPC load for AI workers; Argo CD syncing from the repo; network policies between namespaces.
- Scale-to-zero schedules and stop/start scripts to keep AKS cheap.
- Preview hosting: a build job turns an exported project into static files hosted under `<project>.preview.<domain>` with TLS via cert-manager.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-08](epics/L-08-kubernetes-maturity.md) | **Kubernetes maturity** | Helm charts, kind scripts, KEDA + HPA, Argo CD GitOps, network policies, secrets, scale-to-zero schedules. | P-01…P-07 | 5 |
| [L-10](epics/L-10-preview-hosting.md) | **Preview hosting** | Build pipeline for exported projects, static hosting per project under a subdomain, TLS, cleanup policies, "Publish preview" in Studio. | P-07, L-08 | 7 |
