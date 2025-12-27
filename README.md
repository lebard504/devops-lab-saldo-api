# **📘 Balance API – DevOps Kubernetes Lab**

Simple TypeScript microservice used as a reference workload for a DevOps technical challenge.  
This repository demonstrates a full CI/CD and GitOps workflow using Docker, Kubernetes, ArgoCD and Kong Gateway.

---

**🚀 Overview**

This project showcases an end-to-end DevOps flow:

- Develop a simple API in TypeScript
- Containerize it using Docker best practices
- Build & test it in CI
- Push image to a container registry
- Deploy to Kubernetes using GitOps (ArgoCD)
- Expose and control traffic via Kong API Gateway

The API itself is intentionally simple.  
The main goal is to demonstrate ****automation, infrastructure as code, and delivery flow**** from commit to production.

---

**🧱 Tech Stack**

- Node.js
- TypeScript
- Express
- Jest (testing)
- ESLint (linting)
- Nodemon (local development)
- Docker (multi-stage builds)
- Kubernetes (Minikube)
- ArgoCD (GitOps)
- Kong Gateway (API Gateway)

---

**🏗️ High Level Architecture**
Developer → GitHub → CI → Container Registry → ArgoCD → Kubernetes → Kong → Client

Flow description:

1. Developer pushes code to GitHub
2. CI pipeline builds and tests the API
3. Docker image is built and pushed to registry
4. Kubernetes manifests reference the image
5. ArgoCD syncs manifests into the cluster
6. Kong exposes the API with traffic control

---

**📂 Project Structure**

---

**🔌 Configuration & API**

**⚙️ Environment Variables**
Create a .env file based on .env.example:
```
PORT=10000
```
⚠️ Do not commit real .env files. Secrets must be managed via CI/CD and Kubernetes.

**▶️ Run Locally (Development)**
From the root:
```
cd app
npm install
npm run dev
```

**Endpoint**
API will be available at:
```
http://localhost:10000/balance
```

Example response

```json
{
  "success": true,
  "data": {
    "balance": 123.45,
    "currency": "USD"
  }
}
```

**🧪 Run Tests**
```
npm test
```

**🧹 Run Lint**
```
npm run lint
```

---
### 🐳 Docker

The API is containerized using a **multi-stage Docker build** following container security and optimization best practices.

### ✅ Key Improvements & Practices

- **Multi-stage build**  
  Separates build-time dependencies from runtime to avoid shipping dev tools.

- **Single-file bundle**  
  The TypeScript app is bundled into a single `bundle.js` using `esbuild`, reducing runtime dependencies and attack surface.

- **Minimal runtime image (Chainguard)**  
  Uses `cgr.dev/chainguard/node` as a hardened runtime focused on security: no shell, no package manager, reduced OS surface, fewer CVEs, SBOM included, signed images, non-root by default.

- **Non-root execution**  
  The container runs as a non-root user by default (UID `65532`).

- **No dev dependencies in runtime**  
  Only the final JS artifact is copied into the runtime stage.

- **Optimized image size**  
  The compressed image pushed to the registry is ~55MB, keeping network and storage usage efficient.

[image 1]
---
### 📦 Build image
From the repository root:
```
docker build -t balance-api:local ./app
```
#### **▶️ Run container**
```
docker run -p 10000:10000 balance-api:local
```
**👤 Verify non-root execution**
```
docker inspect balance-api:local --format='{{.Config.User}}'
```
**📊 Check image size**
Uncompressed local size:
```
docker images | grep balance-api
```
Compressed size (as pushed to a registry):
```
docker save balance-api:local | gzip | wc -c
```

---
## 🔁 Continuous Integration (CI)

This project implements a complete **CI pipeline using GitHub Actions**. The pipeline is responsible for validating the code, running automated tests, building the Docker image using a multi-stage Dockerfile, and publishing it to **GitHub Container Registry (GHCR)**.

### 🎯 CI Objectives

The CI pipeline ensures that:

- ✅ Dependencies are installed
- 🧪 Automated tests are executed
- 🐳 The Docker image is built using a multi-stage build (Chainguard base images)
- 📦 The image is pushed to GitHub Container Registry
- 🏷️ Images are versioned using Git tags (semantic versioning)

This guarantees that only tested and validated images are released.
### ⚙️ Trigger Strategy

The pipeline is triggered **only when a Git tag is pushed** that matches the pattern:
```
git tag v0.1.1
git push origin v0.1.1
```

### 🗂️ Workflow Location

GitHub automatically detects workflows located at:
```
.github/workflows/ci-release.yml
```

### 🐳 Docker Image Versioning

Each image is tagged automatically using the Git tag that triggered the pipeline:
```
ghcr.io/<github-username>/<repository>:<git-tag>
```
Example:
```
ghcr.io/lebard504/devops-lab-saldo-api:v0.1.1
```

### 📦 GitHub Container Registry (GHCR)
* Images are published to **GitHub Container Registry**
* The registry is integrated natively with GitHub
* Authentication is handled using the built-in GITHUB_TOKEN
* No additional secrets are required
* mages are public for easy consumption in Kubernetes

You can view published images at:
```
https://github.com/lebard504/devops-lab-saldo-api/pkgs/container/devops-lab-saldo-api
```

**🔄 CI Flow Summary**
```
Git Tag Push (vX.Y.Z)
        │
        ▼
GitHub Actions CI Pipeline
        │
        ├── Install dependencies
        ├── Run tests
        ├── Build Docker image
        └── Push image to GHCR
        │
        ▼
Validated container image ready for deployment
```

**✅ Outcome**
With this CI pipeline in place:
* Only tested code is released
* Images are reproducible and traceable by version
* The pipeline integrates seamlessly with the GitOps-based CD process using Argo CD

---
### 🛡️ Why Chainguard instead of Alpine?

Although node:alpine can be slightly smaller in uncompressed size, Chainguard images are chosen because they:
* Are **hardened by default**
* Contain **no package manager or shell**
* Have a **reduced attack surface**
* Provide **SBOM and provenance**
* Run as **non-root by default**
This prioritizes **security and supply-chain integrity** over raw image size, aligning with production-grade container best practices.

---
### 🎯 Goal of This Lab

This repository will be extended to include:
	* 	CI pipeline (GitHub Actions)
	* 	Image publishing to registry
	* 	Kubernetes manifests
	* 	ArgoCD Application definition
	* 	Kong Ingress configuration
	* 	Rate limiting and security controls

Each step will be committed incrementally to show the full DevOps lifecycle.

---
### 📌 Status

✅ API implemented
✅ TypeScript setup
✅ Tests, lint, nodemon
✅ Dockerized API
✅ CI pipeline
⬜ Kubernetes manifests
⬜ ArgoCD integration
⬜ Kong Gateway setup

---
**👤 Author**
DevOps Lab by Edwin Rafael Sánchez Ruiz