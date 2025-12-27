set -e

echo "Starting Minikube..."
minikube start

echo "Enabling metrics-server..."
minikube addons enable metrics-server

echo "✅ Minikube ready"