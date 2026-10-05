# Cloud-Native Employee Management Application

A cloud-native Employee Management application built with Flask, MySQL, Docker, Kubernetes and AWS.

The application provides employee CRUD operations and is deployed on Amazon EKS with Amazon RDS MySQL.

## Architecture

GitHub → Docker → Amazon ECR → Amazon EKS → Amazon RDS

## For snapshots --> Visit Docs 

## Tech Stack

- Python / Flask
- MySQL
- HTML / CSS / JavaScript
- Docker
- Kubernetes
- Helm
- AWS
- Git / GitHub

## AWS Services

- Amazon VPC
- Amazon EKS
- Amazon ECR
- Amazon RDS (MySQL)
- Elastic Load Balancing
- Amazon CloudWatch
- IAM
- NAT Gateway

## Application Features

- Add employee
- View employees
- Update employee
- Delete employee
- Search employees
- Department and salary details

## AWS Deployment

- EKS worker nodes are deployed in private subnets.
- RDS MySQL is deployed in private subnets.
- Elastic Load Balancer provides external access to the application.
- NAT Gateway provides outbound internet access for private resources.
- Security Groups control traffic between the application and database.
- CloudWatch is used for EKS cluster and workload monitoring.

## Kubernetes

The application is deployed using Kubernetes and Helm.

Resources used:

- Deployment
- Service
- ConfigMap
- Secret
- HPA
- Helm Chart

## Database

**Database:** `employee_db`

**Table:** `employees`

The Flask application connects to Amazon RDS MySQL running in the private subnet.

## Project Structure

```text
cloud-native-employee-app/
├── employee-app/
├── kubernetes/
├── static/
├── templates/
├── app.py
├── Dockerfile
├── requirements.txt
└── README.md

## Key Points

- Containerized Flask application using Docker
- Docker image stored in Amazon ECR
- Application deployed on Amazon EKS
- MySQL database hosted on Amazon RDS
- Custom VPC with public and private subnets
- Secure communication using AWS Security Groups
- EKS monitoring using Amazon CloudWatch
- Kubernetes deployment managed using Helm

## Future Improvements
- GitHub Actions CI/CD
- HTTPS with AWS Certificate Manager
- Custom domain using Route 53
- AWS Secrets Manager
- Infrastructure as Code using Terraform