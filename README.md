# 🚌 Ives Travels – Serverless Bus Booking Platform

*A full‑stack, cloud‑native ticket‑booking application demonstrating real‑world, serverless design on AWS.*

Users can select seats, pay via **CamPay mobile‑money**, and receive instantly confirmed bookings.  
The entire workflow runs on an **AWS serverless architecture** — zero servers to manage, low idle cost, and infinite scalability.

## 🌍 Live Demo

**Frontend:** [d21vgeeggf0a1d.cloudfront.net](https://d21vgeeggf0a1d.cloudfront.net)
**Backend API (read‑only):** https://htqghe2vn0.execute-api.us-east-1.amazonaws.com/Prod/bookings/BKG-1760742249582

*(Payments run in CamPay’s sandbox so  real money moves. For testing, i've limited the amount to 100frs cfa, which is not fair of campay, because should be a demo account)*

---

## 🧩 Architecture
Frontend ──► API Gateway ──► AWS Lambda ──► DynamoDB
│
└─► CamPay webhook → Lambda → DynamoDB 


**Key AWS Services**

| Layer | Service |
|--------|----------|
| **Compute** | AWS Lambda (Node 20) |
| **API Gateway** | REST API with Lambda Proxy Integration |
| **Database** | DynamoDB (pay‑per‑request) |
| **Secrets & Auth** | AWS Secrets Manager (stores CamPay credentials) |
| **Infrastructure as Code** | AWS SAM (CloudFormation template) |
| **Static Hosting** | S3 + CloudFront |
| **Monitoring** | CloudWatch Logs |

---

## 💡 Highlights

- 🎟️ Interactive seat‑selection UI  
- 💳 Real mobile‑money integration through CamPay sandbox (100 FCFA limit)  
- 🔁 Webhook callback for instant payment‑status updates  
- 🧾 Automated booking‑status transition in DynamoDB (*PENDING → PAID / FAILED*)  
- ☁️ Fully serverless and auto‑scaling  
- 🏗️ Infrastructure as Code for one‑command deployment  
- 🔒 Safe API and credential management via AWS Secrets Manager  
- 💡 Resilient error handling and observability through CloudWatch logs  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML / CSS / Vanilla JavaScript |
| **Backend Functions** | Node 20 on AWS Lambda |
| **Infrastructure** | AWS SAM + CloudFormation |
| **Database** | DynamoDB |
| **Payments** | CamPay v2 API (“demo” live‑micro‑payments) |
| **Secrets** | AWS Secrets Manager |
| **Monitoring** | CloudWatch Logs & Metrics |

---

## 🗂️ Project Structure
backend/
├── src/
│ ├── initiateBooking.js → creates booking & starts payment
│ ├── confirmBooking.js → handles seat confirmation logic
│ ├── campayCallback.js → webhook updates DynamoDB status
│ ├── getBookingStatus.js → fetch booking status by ID
│ └── corsOptions.js → generic CORS handler
├── template.yaml → AWS SAM IaC template
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

# 3️⃣ Upload frontend to S3 + invalidate CloudFront
aws s3 sync ./frontend s3://YOUR_BUCKET_NAME --delete
aws cloudfront create-invalidation \
    --distribution-id YOUR_CF_ID --paths "/*"


💳 Payment Lifecycle (100 FCFA cap demo)
Frontend calls /bookings/confirm to initiate CamPay payment.
ConfirmBookingFunction contacts CamPay’s API (/collection) → returns reference.
CamPay makes a callback POST to /payments/callback.
campayCallback Lambda parses payload → updates DynamoDB status to PAID.
(Next phase) DynamoDB stream → receipt Lambda → upload PDF to S3.
⚠️ About CamPay “Demo” Mode
Through testing and confirmation from CamPay support (see documentation chat):

The environment at demo.campay.net operates on the real mobile‑money network with a limited amount (≈ 100 FCFA per transaction).

Precautions Implemented

Hard limit checks in code to reject payments > 100 FCFA during demo.
Clear README disclosure.
Dedicated test wallet used for sandbox sessions.
Employers interested in production roll‑out can replace demo.campay.net with campay.net and update the Secrets Manager credentials.

📈 Results Observed
Successful callbacks updating DynamoDB records to PAID.
Clean, structured logs within CloudWatch.
Fully automated deployment on AWS via sam build && sam deploy.
Verified payment limit behaviour confirmed with CamPay help desk.


🧑‍💻 Author
Fru Ivo N.
Cloud / Serverless Developer  |  Node.js  |  AWS  |  Payments Integration