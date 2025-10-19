import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
const db = new DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const bookingId = `BKG-${uuidv4().slice(0, 8)}`;

    const item = {
      bookingId,
      agency: data.agency,
      origin: data.origin,
      destination: data.destination,
      travelDate: data.travelDate,
      tripTime: data.tripTime,
      tickets: data.tickets,
      status: "INITIATED",
      createdAt: new Date().toISOString()
    };

    await db.put({ TableName: process.env.BOOKINGS_TABLE, Item: item }).promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ bookingId, message: "Booking initiated" })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};