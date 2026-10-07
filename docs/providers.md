# Providers and capabilities

JodKit separates **what** the platform needs from **who** implements it.

## Capabilities

Named integration slots registered in core, implemented by plugins:

```text
payment, shipping, tax, email, sms, storage, search, ai,
analytics, authentication, cdn, image-processing, ...
```

Discovery is dynamic: a Razorpay plugin **implements** `payment`; a Shiprocket plugin **implements** `shipping`.

Machine-readable examples: [../.ai/capabilities.json](../.ai/capabilities.json) (`"documentationOnly": true`).

## Provider contracts

Providers implement stable interfaces, e.g.:

```ts
interface PaymentProvider {
  id: string
  name: string
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>
  verifyPayment(input: VerifyPaymentInput): Promise<PaymentResult>
  refund(input: RefundInput): Promise<RefundResult>
}
```

Same pattern applies to shipping, storage, search, etc. Ecommerce **modules** call contracts; **plugins** supply vendors.

## Ecommerce integrations (examples only)

Payment, shipping, tax, and media storage lists in the foundation (Stripe, Razorpay, Shiprocket, S3, ...) are **examples**, not built-in core code.

## Commerce engine (open decision)

| Option | Summary |
|--------|---------|
| A | Build commerce engine natively |
| B | Integrate Medusa, Vendure, or similar |
| C | Study existing engines; build native engine on platform contracts |

**Current direction:** Option C is the preferred **investigation** area - **not finalized**.

## Future: Provider Builder

Configure external APIs (endpoints, auth, mapping, webhooks) to generate provider plugins; AI-assisted generation from vendor docs is a long-term goal.

---

**Full detail:** [Foundation section 10-12 Capabilities & providers](project-foundation-v0.1.md#10-capability-system) | [section 22-23 Ecommerce providers & engine](project-foundation-v0.1.md#22-ecommerce-providers)
