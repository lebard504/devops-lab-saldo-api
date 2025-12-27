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
        ├── Checkout code
        ├── Install dependencies
        ├── Run tests
        ├── Build Docker image
        ├── Push image to GHCR
        ├── Update Kubernetes manifest with new tag
        └── Commit & push manifest to repo
        │
        ▼
GitOps CD with Argo CD
        │
        ├── Detects change in k8s/ manifests
        ├── Auto-sync enabled
        └── Applies new image to cluster
        │
        ▼
Kubernetes Deployment updated automatically
```

### ✅ Outcome

With this CI/CD pipeline in place:
* Only tested code is released
* Images are versioned and traceable via Git tags
* Kubernetes manifests are updated automatically by CI
* Argo CD applies changes using GitOps principles
* No manual kubectl apply needed for deployments

---
### **🚀 Local Setup Guide (Minikube + ArgoCD)**

### 🧰 Prerequisites
* Docker
* kubectl
* Minikube
* Helm
* Git

**▶️ 1. Start Minikube**
```
minikube start
```

Enable metrics server (needed for HPA):
```
minikube addons enable metrics-server
```

**⚙️ 2. Install Argo CD with Helm**
```
kubectl create namespace argocd

helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

helm install argocd argo/argo-cd -n argocd
```

Verify:
```
kubectl get all -n argocd
```

**🔐 3. Access Argo CD UI**

Port-forward:
```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Get admin password:
```
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 --decode && echo
```

Login at:
👉 https://localhost:8080
User: admin

[Image 2]

**📦 4. Create namespace for app**
```
kubectl create namespace balance
```

**🔑 5. Create GHCR image pull secret**
⚠️ In real scenarios, never commit tokens. Use GitHub secrets or PAT with read:packages.
```
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=lebard504 \
  --docker-password={GHCR_TOKEN} \
  --docker-email=lebard504@gmail.com \
  -n balance
```

Verify:
```
kubectl get secret ghcr-secret -n balance
```
Inspect (optional):
```
kubectl get secret ghcr-secret -n balance -o yaml

kubectl get secret ghcr-secret -n balance \
  -o jsonpath='{.data.\.dockerconfigjson}' | base64 --decode
```

**📄 6. Register ArgoCD Application**
Apply:
```
kubectl apply -f argocd/application.yaml
```

This Application:
* Watches k8s/ folder
* Auto-sync enabled
* Self-heal enabled

Verify in UI → Application should appear as **Synced & Healthy**.
[image 3]

**🌐 7. Access the API locally**
```
kubectl port-forward svc/balance-api -n balance 9090:80
```

Test:
```
curl --location 'http://localhost:9090/balance'
```

**📈 8. Validate HPA & Metrics**
```
kubectl get hpa -n balance
kubectl describe hpa balance-api-hpa -n balance

kubectl top pods -n balance
```

**🔥 9. Generate Load to Trigger Autoscaling**
```
kubectl run -it --rm loadgen --image=busybox -n balance -- sh
```
Inside pod:
```
while true; do wget -q -O- http://balance-api.balance.svc.cluster.local; done
```
Watch scaling:
```
kubectl get hpa -n balance -w
kubectl get pods -n balance -w
```

[Image 4]

**🔄 10. Manual scale test (optional)**
```
kubectl scale deploy balance-api -n balance --replicas=2
```

**🏷️ 11. Release a New Version (CI/CD Test)**
Example:
```
git tag v0.1.4
git push origin v0.1.4
```

This will:
* Trigger GitHub Actions
* Build & push image to GHCR
* Update k8s/deployment.yaml
* Commit change
* ArgoCD auto-syncs
* New pods roll out automatically

Verify:
```
kubectl get deploy balance-api -n balance \
  -o jsonpath='{.spec.template.spec.containers[0].image}'
```


### 🏗️ Infrastructure as Code (IaC) – k8s/ Folder

This repository follows an **Infrastructure as Code** approach: the full Kubernetes runtime configuration for the API is defined as declarative YAML inside k8s/.
**Git is the single source of truth** for the desired cluster state, and **Argo CD continuously reconciles** the cluster against these manifests.

### 📁 k8s/ contents

**1) namespace.yaml**
Creates the namespace where the workload runs.
* **Namespace**: balance
* Reason: isolates app resources from argocd and other workloads.

**2) deployment.yaml**
Defines how the API is executed inside the cluster.
* Deploys **2 replicas** by default (can be controlled by HPA)
* Uses imagePullSecrets: ghcr-secret to pull from GHCR
* Container exposes containerPort: 10000
* Resource requests/limits are defined to support predictable scheduling and autoscaling

Key point:
* The **image tag is pinned** (e.g., ghcr.io/lebard504/devops-lab-saldo-api:v0.1.3) to ensure reproducible deployments.
* CI can update this tag automatically by committing changes back into k8s/deployment.yaml.

**3) service.yaml**
Exposes the Deployment internally using a stable DNS name.
* Type: ClusterIP
* Port: 80
* Target: container 10000

This enables:
* In-cluster access via:
http://balance-api.balance.svc.cluster.local
* Local testing via:
  kubectl port-forward svc/balance-api -n balance 9090:80

**4) hpa.yaml**
Adds autoscaling based on CPU utilization.
* Scales the Deployment when CPU crosses the target threshold
* Example configuration:
* minReplicas: 2
* maxReplicas: 5
* targetCPUUtilizationPercentage: 70 *(or 50% if required by the challenge)*

Note: HPA requires the **metrics-server** addon enabled in Minikube.

**5) ingress.yaml (NOT YET)**

### 🔁 GitOps Reconciliation with Argo CD

Argo CD is configured to watch the k8s/ folder and continuously reconcile it into the cluster.
* **Observed path**: k8s/
* **Sync policy**: automated
* **Self-heal**: enabled
* **Prune**: enabled (removes resources deleted from Git)

The Argo CD Application manifest is stored at:
* argocd/application.yaml

It points to:
* repoURL: https://github.com/lebard504/devops-lab-saldo-api.git
* targetRevision: main
* path: k8s

This ensures:
* Any change committed into k8s/ becomes the new desired state
* Argo CD applies it automatically without manual kubectl apply

### ✅ Benefits of this approach
* Full environment defined as code
* Reproducible and auditable deployments
* Git is the source of truth
* Automatic reconciliation via Argo CD
* Clear separation between CI (build) and CD (deploy)





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
✅Kubernetes manifests
✅ ArgoCD integration
⬜ Kong Gateway setup

---
**👤 Author**
DevOps Lab by Edwin Rafael Sánchez Ruiz