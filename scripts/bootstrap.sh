set -e

echo "Bootstrapping full lab environment..."

./scripts/setup-minikube.sh
./scripts/install-argocd.sh
./scripts/install-kong.sh

echo "Applying base Kubernetes manifests..."
kubectl apply -f k8s/namespace.yaml

echo "Bootstrap completed"
echo "👉 You can now access Argo CD and let GitOps sync the app manifests."