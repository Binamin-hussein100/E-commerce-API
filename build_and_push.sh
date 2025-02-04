#!/bin/bash

services=("user-service" "notification-service" "cart-service" "payment-service" "product-service" "order-serviceclea")

for service in "${services[@]}"; do
  echo "Building and pushing $service..."
  
  # Navigate to service directory
  cd "services/$service" || exit 1

  # Build and push Docker image
  docker build -t "binamin/$service:latest" .
  docker push "binamin/$service:latest"

  # Return to root project directory
  cd - || exit 1
done
