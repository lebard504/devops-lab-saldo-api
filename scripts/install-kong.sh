set -e

echo "Installing Kong Gateway..."

kubectl create namespace kong --dry-run=client -o yaml | kubectl apply -f -

helm repo add kong https://charts.konghq.com
helm repo update

helm upgrade --install kong kong/kong \
  -n kong \
  -f k8s/kong/values.yaml

echo "✅ Kong installed"