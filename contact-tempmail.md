# Temporary Email Blocking Strategy

To effectively block temporary or "burnable" email domains in the contact form while maintaining system performance, we use a multi-tiered approach.

## 1. Local Blacklist (O(1) Lookup)

For common domains, we maintain a `public/data/tempmail.json` file. This is loaded and converted into a `Set` for high-speed lookups during form validation.

### Implementation Steps:

1. Ensure `public/data/tempmail.json` contains an array of domains.
2. In the `ContactForm.tsx`, fetch this JSON and use a `Set` for checking:

   ```typescript
   const tempMailResponse = await fetch("/data/tempmail.json");
   const { domains } = await tempMailResponse.json();
   const domainSet = new Set(domains);

   if (domainSet.has(emailDomain)) {
     // Block submission
   }
   ```

## 2. Optimized Large-Scale Lookups

When dealing with 1,000+ domains, loading them all into the browser's memory for every visitor can be heavy. Consider these optimizations:

### A. Pre-compiled Bloom Filter

For extremely large lists (10k+), a Bloom Filter can provide a probabilistic check (zero false negatives) in a much smaller file size.

### B. Server-Side Validation (API Route)

Instead of fetching the entire JSON on the client, perform the check in a Next.js API route. This keeps the blacklist data on the server.

1. Create `app/api/validate-email/route.ts`.
2. Move the `tempmail.json` check logic there.
3. Call this API from the `ContactForm.tsx`.

## 3. Maintenance

To keep the list up to date:

- Periodically sync `public/data/tempmail.json` with community-maintained lists like [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains).
- Use automated scripts to filter and deduplicate domains before adding them to the project.

---

_Note: This strategy ensures that even with a large number of blocked domains, the user experience remains fast and the form remains secure._
