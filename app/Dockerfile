# ---------- Stage 1: Build ----------
# Chainguard Node dev image (includes npm and build tools)
FROM cgr.dev/chainguard/node@sha256:5e1ebdfc0c312d785515f403e309a8f6edf735eee96dd0d156328f5867c48742 AS builder

WORKDIR /app

# Copy dependency manifests first for better cache
COPY package*.json ./

# Install all deps (including dev) to build/bundle
RUN npm ci

# Copy source code
COPY . .

# Bundle TypeScript into a single JS file
RUN npm run bundle


# ---------- Stage 2: Runtime ----------
# Minimal Chainguard Node runtime image
FROM cgr.dev/chainguard/node@sha256:cb2e23fc54f66364d4d5e5a4e18a0abe3a076c4d791df2b659b25bca256f0220

WORKDIR /app

# Copy only the bundled artifact from builder
COPY --from=builder /app/dist/bundle.js ./bundle.js

# Chainguard runs as non-root by default (uid 65532)
USER 65532

EXPOSE 10000

# Run the app
CMD ["bundle.js"]