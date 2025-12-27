set -e

echo "Bootstrapping full lab environment..."

echo "Starting Minikube..."
minikube start

echo "Using minikube context..."
kubectl config use-context minikube

echo "Enabling metrics-server..."
minikube addons enable metrics-server

echo "Installing Argo CD..."
./scripts/install-argocd.sh

echo "Installing Kong Gateway..."
./scripts/install-kong.sh

echo "Applying Argo CD Application..."
kubectl apply -f argocd/application.yaml

echo "✅ Bootstrap completed"
echo "👉 Argo CD will now sync all k8s manifests via GitOps."