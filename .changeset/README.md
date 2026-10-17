# Changesets

Every pull request that changes `packages/` adds a changeset: `npm run changeset`, pick the
packages, pick the bump (see the semver rules for tokens in `docs/spec.md` B7), and write one
line for the changelog. Merging to `main` opens a Release PR; merging that publishes to npm.
