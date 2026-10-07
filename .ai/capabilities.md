# Capabilities schema (documentation)

[`capabilities.json`](capabilities.json) is the **machine-readable example schema** (`documentationOnly: true`). It is not a live platform registry.

This markdown file explains purpose and usage for humans and AI agents. The JSON block below mirrors the file for offline reading.

**This is not live platform state** - JodKit has no runtime capability registry during Architecture / Research.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$comment": "JodKit documentation artifact - NOT live platform state.",
  "documentationOnly": true,
  "platformPhase": "architecture-research",
  "description": "Example capability IDs and provider declarations for AI agents planning JodKit extensions.",
  "capabilityIds": [
    "payment",
    "shipping",
    "tax",
    "email",
    "sms",
    "storage",
    "search",
    "ai",
    "analytics",
    "authentication",
    "cdn",
    "image-processing",
    "notifications"
  ],
  "exampleProviders": [
    {
      "example": true,
      "pluginId": "razorpay",
      "implements": ["payment"],
      "providerContract": "PaymentProvider"
    },
    {
      "example": true,
      "pluginId": "shiprocket",
      "implements": ["shipping"],
      "providerContract": "ShippingProvider"
    },
    {
      "example": true,
      "pluginId": "s3-storage",
      "implements": ["storage"],
      "providerContract": "StorageProvider"
    }
  ],
  "exampleProjectManifest": {
    "example": true,
    "description": "Illustrative per-site manifest - future CLI may generate this.",
    "platformVersion": "1.0",
    "modules": ["cms", "auth", "media", "commerce", "seo"],
    "plugins": ["reviews", "razorpay"],
    "theme": "storefront",
    "database": "postgresql"
  },
  "exampleModuleManifest": {
    "example": true,
    "name": "ecommerce",
    "version": "1.0.0",
    "dependencies": ["core", "users", "media"],
    "optionalDependencies": ["forms", "seo"],
    "capabilities": [
      "products",
      "cart",
      "checkout",
      "orders",
      "payments",
      "inventory"
    ]
  }
}
```

See [docs/providers.md](../docs/providers.md) and [Foundation section 10](../docs/project-foundation-v0.1.md#10-capability-system).
