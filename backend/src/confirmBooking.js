// -----------------------------------------------------------------------------
//  confirmBooking.js  —  AWS Lambda (ES Module)  +  Campay payment initiation
// -----------------------------------------------------------------------------

import AWS from "aws-sdk";               // CommonJS module, import as default
import fetch from "node-fetch";

const { DynamoDB, SecretsManager } = AWS;
const db = new DynamoDB.DocumentClient();
const sm = new SecretsManager();

/**
 * Helper: Read Campay API token stored in Secrets Manager
 */
async function getCampayCreds() {
  const secret = await sm.getSecretValue({ SecretId: process.env.SECRET_NAME }).promise();
  return JSON.parse(secret.SecretString);
}

/**
 * Lambda handler
 */
export const handler = async (event) => {
  // --- 1️⃣  Handle browser preflight (CORS) ------------------------------
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: ""
    };
  }

  // --- 2️⃣  Main booking + payment logic ---------------------------------
  try {
    const body = JSON.parse(event.body || "{}");
    const { bookingId, selectedSeats = [], phone } = body;

    if (!bookingId || !selectedSeats.length || !phone) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Missing required booking data" })
      };
    }

    // Pull Campay credentials
    const creds = await getCampayCreds();
    const campayUrl = process.env.CAMPAY_BASE_URL || "https://demo.campay.net/api";
    const amount = 100; // basic fare logic

    console.log("➡️  Calling Campay:", campayUrl + "/collection");
    console.log("Payload:", { from: phone, amount, bookingId });

    // --- make the API call ------------------------------------------------
    const res = await fetch(`${campayUrl}/collect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${creds.token}`
      },
    body: JSON.stringify({
      amount,
      currency: "XAF",
      from: phone,
      description: `Booking ${bookingId}`,
      external_reference: bookingId
    })
    });

    const text = await res.text();                    // may not be JSON
    console.log("Campay status:", res.status);
    console.log("Campay raw response (first 300 chars):", text.substring(0, 300));

    let campayData = {};
    try {
      campayData = JSON.parse(text);
    } catch {
      console.warn("⚠️  Campay response not JSON; returning raw text snippet");
      campayData = { raw: text };
    }

    // Log result
    await db.update({
      TableName: process.env.BOOKINGS_TABLE,
      Key: { bookingId },
      UpdateExpression: "SET seats = :s, #st = :st, campayResponse = :r",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":s": selectedSeats,
        ":st": "PENDING_PAYMENT",
        ":r": campayData
      }
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({
        bookingId,
        paymentRef: campayData.reference || "N/A",
        message: res.status === 200 ? "Payment initiated" : "Campay returned non‑200",
        campayStatus: res.status
      })
    };
  }

  // --- 3️⃣  Generic catch‑all ---------------------------------------------
  catch (err) {
    console.error("❌  ERROR in ConfirmBooking:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};