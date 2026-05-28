# Features Layer

Each folder in `features/` is one business domain.

Suggested structure:

```txt
features/<domain>/
├─ ui/            # React UI for this domain
├─ model/         # Domain types/constants/selectors
├─ service/       # API calls/use-cases
└─ hooks/         # Feature-scoped hooks
```

Rules:

- Feature code should not import from `app/`.
- Prefer feature-local types before putting them in global `types/`.
