# CLAUDE.md — Bar Hop SF

Bar Hop SF is a personal journal for San Francisco bars, built for a class assignment. The full plan (features, database, tests, tech stack, design) is in `PLAN.md`. Read it before starting any feature.

## Workflow rules (apply to every change)

1. **Never commit directly to `main`.** Every change goes through:
   - a GitHub Issue,
   - a feature branch,
   - a pull request into `main` whose description includes `closes #N` (where `#N` is the Issue).
2. **One feature per branch and PR**, built in the order listed in `PLAN.md` section 2.
3. **Save the key prompts** for each feature in `prompts/<feature>.md` on that feature's branch.
