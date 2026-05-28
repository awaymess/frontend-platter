# Widgets Layer

`widgets/` contains reusable composed sections (layout shells, page-level blocks, feedback wrappers).

Rules:

- Widgets can consume `features` only when explicitly intended for that domain.
- Keep widget APIs simple and presentation-focused.
- Avoid business logic in widgets when it belongs to a feature.
