export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  const apiKey = process.env.LDK_AI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "Server is missing LDK_AI_API_KEY"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const body = await req.json();

    const upstream = await fetch(
      "https://api.ejolabs.com/api/v1/subiza",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        },
        body: JSON.stringify(body)
      }
    );

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Could not reach the Ejo AI service",
        details: err.message
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};