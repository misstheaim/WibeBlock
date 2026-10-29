# Feature — Serverless jobs

> Part: [Platform](../platform.md) · Epics: P-15

## Purpose

Small event-driven jobs on **Azure Functions** (D-18): work that must keep running while the AKS cluster is stopped, or that only runs now and then. It gives Functions a real job and teaches the serverless model (triggers, bindings, consumption billing) next to Kubernetes.

## Design notes

- Three jobs:
  - **Stripe webhook intake** (HTTP trigger → Service Bus queue). Verifies the Stripe signature and queues the event. The Billing module consumes the queue when the cluster runs, so webhooks are not lost while it is stopped. Before P-15 exists, webhooks go straight to the Core API through the Gateway (P-09).
  - **Export cleanup** (timer trigger). Deletes expired export zips from Blob storage.
  - **Asset processing** (Blob trigger). Resizes uploaded images and creates thumbnails for platform projects; the Projects module stores only the originals.
- One Functions app, .NET isolated worker model, in `backend/Functions`. The asset job may be written in Node instead if it can reuse the Studio's image optimiser from S-16; decide when planning the epic.
- Local: Azure Functions Core Tools with Azurite and RabbitMQ under Aspire. The Service Bus trigger and output binding switch to the message bus abstraction locally, or use the Service Bus emulator; decide in the epic.
- Cloud: Consumption (or Flex Consumption) plan, deployed by Terraform in P-13; secrets from Key Vault; OpenTelemetry to the same backend as the services.
- Functions are not a second home for product logic: they receive, clean up or transform, then hand off to the bus or Blob storage. Everything else stays in Kubernetes (D-09).

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-15](epics/P-15-serverless-jobs.md) | **Serverless jobs (Azure Functions)** | Functions app with Stripe webhook intake to a queue, export cleanup timer, asset thumbnail job; local run with Core Tools + Azurite under Aspire; Terraform deployment in P-13. | P-04, P-09, L-01 | 5 |
