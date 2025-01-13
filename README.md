# E-Commerce Platform: Scalable Microservices Architecture

This repository contains the source code for an e-commerce platform built using a **microservices architecture**. The platform is designed to be scalable, resilient, and maintainable, leveraging modern tools and frameworks for backend development and deployment.

## **Project Overview**
The platform consists of multiple independent microservices, each handling specific functionalities of the e-commerce system. These services are containerized using Docker and orchestrated using Kubernetes (k8s). A blue-green deployment strategy is implemented to ensure zero-downtime deployments and smooth version rollouts.

### **Core Features**
- User authentication and profile management.
- Product catalog management with categories and inventory.
- Shopping cart and order processing.
- Integration with payment gateways.
- Notification services for email or SMS alerts.
- API Gateway for unified routing.


## **Folder Structure**
```plaintext
/your-project-root
│
├── services
│   ├── order-service
│   ├── product-service
│   ├── payment-service
│   ├── user-service
│   ├── cart-service
│   └── notification-service
│
└── k8s
    ├── order-service
    │   ├── blue-deployment.yaml
    │   ├── green-deployment.yaml
    │   ├── service.yaml
    │   └── ingress.yaml
    ├── product-service
    │   ├── blue-deployment.yaml
    │   ├── green-deployment.yaml
    │   ├── service.yaml
    │   └── ingress.yaml
    ├── payment-service
    │   ├── blue-deployment.yaml
    │   ├── green-deployment.yaml
    │   ├── service.yaml
    │   └── ingress.yaml
    ├── user-service
    │   ├── blue-deployment.yaml
    │   ├── green-deployment.yaml
    │   ├── service.yaml
    │   └── ingress.yaml
    ├── cart-service
    │   ├── blue-deployment.yaml
    │   ├── green-deployment.yaml
    │   ├── service.yaml
    │   └── ingress.yaml
    └── notification-service
        ├── blue-deployment.yaml
        ├── green-deployment.yaml
        ├── service.yaml
        └── ingress.yaml
```

---

## **Technologies Used**

### **Backend Development**
- **Node.js**: Backend framework for API development.
- **Prisma**: ORM for database interaction.
- **MongoDB**: NoSQL database for services requiring document storage.
- **Redis**: In-memory data store for caching.

### **Containerization and Orchestration**
- **Docker**: To containerize microservices.
- **Kubernetes**: For container orchestration, deployment, and scaling.

### **DevOps Tools**
- **GitHub Actions**: CI/CD pipeline for automated builds and deployments.
- **Prometheus & Grafana**: Monitoring and visualization of metrics.
- **NGINX**: Reverse proxy and API Gateway.

---

## **Blue-Green Deployment**
A blue-green deployment strategy ensures zero downtime during deployments by running two environments (blue and green) side-by-side. Traffic is routed to the active environment (blue by default). Upon validating the green deployment, traffic is switched seamlessly.

### Deployment Files
For each service:
- **`blue-deployment.yaml`**: Defines the blue version of the service.
- **`green-deployment.yaml`**: Defines the green version of the service.
- **`service.yaml`**: Manages traffic routing between blue and green deployments.
- **`ingress.yaml`**: Configures external HTTP/S access for the service.

---

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies for each service:
   ```bash
   cd services/payment-service
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```plaintext
   DATABASE_URL=your_database_url
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DB=your_postgres_db
   ```

## **How to Use This Project**

### **1. Prerequisites**
- Install **Docker** and **Kubernetes**.
- Install **kubectl** for interacting with Kubernetes clusters.
- Install **Helm** for managing Kubernetes applications (optional).

### **2. Set Up Kubernetes Cluster**
- Use Minikube or any managed Kubernetes service (e.g., GKE, EKS, AKS).
- Verify the cluster is running:
  ```bash
  kubectl get nodes
  ```

### **3. Deploy Services**
1. Apply the blue deployment for each service:
   ```bash
   kubectl apply -f k8s/<service-name>/blue-deployment.yaml
   ```
2. Create the Kubernetes Service and Ingress:
   ```bash
   kubectl apply -f k8s/<service-name>/service.yaml
   kubectl apply -f k8s/<service-name>/ingress.yaml
   ```

### **4. Switch to Green Deployment**
- Deploy the green version:
  ```bash
  kubectl apply -f k8s/<service-name>/green-deployment.yaml
  ```
- Update the Service selector to point to the green deployment.

### **5. Monitor Deployments**
- Use Prometheus and Grafana for monitoring:
  - Access Grafana:
    ```bash
    kubectl port-forward svc/grafana 3000:3000
    ```
  - Default login: `admin` / `admin` (change it after login).

---

## **Contributing**
Feel free to submit issues or pull requests to improve the project.

---

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.
