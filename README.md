# 🚌 Ives Travels – Serverless Bus Booking Platform

*A full‑stack, cloud‑native ticket‑booking application demonstrating real‑world, serverless design on AWS.*

Users can select seats, pay via **CamPay mobile‑money**, and receive instantly confirmed bookings.  
The entire workflow runs on an **AWS serverless architecture** — zero servers to manage, low idle cost, and infinite scalability.

---

## 🌍 Live Demo

| Component | URL |
|------------|-----|
| **Frontend** | [https://d21vgeeegf0a1d.cloudfront.net] | https://d21vgeeggf0a1d.cloudfront.net/
| **Backend API (read‑only)** | [https://htqghe2vn0.execute-api.us-east-1.amazonaws.com/Prod/bookings/BKG-1760742249582](https://htqghe2vn0.execute-api.us-east-1.amazonaws.com/Prod/bookings/BKG-1760742249582) |

> ⚠️ **Important:** CamPay’s “demo” environment still executes real mobile‑money transactions (capped at ≈ 100 FCFA).  
> Testing in this project is restricted to 100 FCFA transactions for safety.

---

## 🧩 Architecture
Frontend → API Gateway → AWS Lambda → DynamoDB
↳ CamPay webhook → Lambda → DynamoDB


### Key AWS Services

| Layer | Service |
|-------|----------|
| **Compute** | AWS Lambda (Node 20) |
| **API Gateway** | REST API with Lambda Proxy Integration |
| **Database** | DynamoDB (pay‑per‑request) |
| **Secrets & Auth** | AWS Secrets Manager (stores CamPay credentials) |
| **Infrastructure as Code** | AWS SAM (CloudFormation template) |
| **Static Hosting** | S3 + CloudFront |
| **Monitoring** | CloudWatch Logs |

---

## 💡 Highlights

- 🎟️ Interactive seat‑selection UI  
- 💳 Real mobile‑money integration through CamPay “demo” sandbox (100 FCFA limit)  
- 🔁 Webhook callback for instant payment‑status updates  
- 🧾 Automated booking‑status transition in DynamoDB (*PENDING → PAID / FAILED*)  
- ☁️ Fully serverless and auto‑scaling  
- 🏗️ Infrastructure‑as‑Code for one‑command deployment  
- 🔒 Safe API and credential management via AWS Secrets Manager  
- 💡 Resilient error handling and observability through CloudWatch Logs  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML / CSS / Vanilla JavaScript |
| **Backend Functions** | Node 20 on AWS Lambda |
| **Infrastructure** | AWS SAM + CloudFormation |
| **Database** | DynamoDB |
| **Payments** | CamPay v2 API (“demo” live‑micro‑payments) |
| **Secrets** | AWS Secrets Manager |
| **Monitoring** | CloudWatch Logs & Metrics |

---

## 🗂️ Project Structure
backend/
├── src/
│ ├── initiateBooking.js → creates booking & starts payment
│ ├── confirmBooking.js → handles seat confirmation logic
│ ├── campayCallback.js → webhook updates DynamoDB status
│ ├── getBookingStatus.js → fetch booking status by ID
│ └── corsOptions.js → generic CORS handler
├── template.yaml → AWS SAM Infrastructure‑as‑Code template
└── samconfig.toml → SAM CLI deployment settings

frontend/
├── index.html → seat selection dashboard
├── script.js → API handlers & payment integration
├── styles.css → UI and layout
└── error.html → fallback page


---

## 🚀 Deploy Your Own

```bash
# 1️⃣ Configure AWS credentials
aws configure

# 2️⃣ Deploy backend (API + Lambdas + DynamoDB)
sam build
sam deploy --guided

# 3️⃣ Upload frontend to S3 and invalidate CloudFront
aws s3 sync ./frontend s3://YOUR_BUCKET_NAME --delete
aws cloudfront create-invalidation \
    --distribution-id YOUR_CF_ID --paths "/*"


💳 Payment Lifecycle (100 FCFA cap demo)
Frontend calls /bookings/confirm to initiate CamPay payment.
ConfirmBookingFunction calls CamPay /collection API → returns transaction reference.
CamPay sends callback POST to /payments/callback.
campayCallback Lambda parses payload → updates DynamoDB status to PAID.
(Future extension) DynamoDB stream → receipt Lambda → upload PDF to S3.

⚠️ About CamPay “Demo” Mode
Through testing and CamPay support confirmation:

The environment at demo.campay.net operates on the real mobile‑money network but limits transactions to ≈ 100 FCFA each.

### Precautions Implemented

Hard limit checks in code to reject demo payments > 100 FCFA
Clear README disclosure and warnings
Dedicated low‑balance test wallet for sandbox sessions
Employers interested in a production roll‑out can replace
demo.campay.net with campay.net and update AWS Secrets Manager credentials accordingly.

📈 Results Observed
✅ Successful callbacks updating DynamoDB records to PAID
📄 Clean, structured CloudWatch logs
☁️ Automated IaC deployment on AWS via sam build && sam deploy
💬 Verified payment‑limit behavior confirmed by CamPay help desk
🧑‍💻 Author
Fru Ivo N.
Cloud / Serverless Developer  |  Node.js  |  AWS  |  Payment Integrations
















