import AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const bookingId = event.pathParameters.id;
    const result = await db
      .get({
        TableName: process.env.BOOKINGS_TABLE,
        Key: { bookingId }
      })
      .promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Item || { message: "Booking not found" })
    };
  } catch (err) {
    console.error("GET Booking Status Error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};