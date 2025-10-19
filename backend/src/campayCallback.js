// -----------------------------------------------------------------------------
//  campayCallback.js  —  AWS Lambda handler for CamPay payment webhooks
//  Updates booking status from PENDING_PAYMENT -> PAID (or FAILED).
// -----------------------------------------------------------------------------

import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  // --- 1️⃣  Handle browser preflight (CORS) -------------------------------
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: "",
    };
  }

  try {
    // --- 2️⃣  Parse incoming payload safely --------------------------------
    const rawBody = event.body || "{}";
    let body;

    try {
      body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
    } catch (parseErr) {
      console.warn("⚠️  Could not parse request body as JSON:", rawBody);
      body = {};
    }

    console.log("Incoming CamPay callback body:", JSON.stringify(body));

    // Guard against empty or malformed payloads -----------------------------
    const bookingId = body.external_reference;
    const paymentStatus = body.status;
    const reference = body.reference || body.tx_ref || "n/a";

    if (!bookingId || !paymentStatus) {
      console.warn("⚠️  Missing bookingId or paymentStatus in callback:", body);
      return {
        statusCode: 200, // return 200 so CamPay stops retrying
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Ignored empty or malformed callback" }),
      };
    }

    // --- 3️⃣  Determine new booking status ---------------------------------
    const statusUpper = paymentStatus.toUpperCase();
    let newStatus = "PENDING_PAYMENT";
    if (statusUpper === "SUCCESSFUL" || statusUpper === "SUCCESS") newStatus = "PAID";
    else if (statusUpper === "FAILED") newStatus = "FAILED";

    // --- 4️⃣  Update booking in DynamoDB -----------------------------------
    const updateParams = {
      TableName: process.env.BOOKINGS_TABLE,
      Key: { bookingId },
      UpdateExpression:
        "SET #st = :s, camPayRef = :r, callbackData = :d, updatedAt = :t",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":s": newStatus,
        ":r": reference,
        ":d": body,
        ":t": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    };

    console.log("Attempting DynamoDB update:", JSON.stringify(updateParams, null, 2));
    const result = await db.update(updateParams).promise();
    console.log(`✅ Booking ${bookingId} updated to status ${newStatus}`, result);

    // --- 5️⃣  Return success to CamPay -------------------------------------
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Callback processed successfully",
        bookingId,
        newStatus,
      }),
    };
  } catch (err) {
    console.error("❌ Callback error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};