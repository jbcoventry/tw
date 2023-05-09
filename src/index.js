export default {
  async fetch(request, env) {
    const kv = env.kv;

    if (request.method === "POST") {
      return handlePOSTRequest();
    } else if (request.method === "GET") {
      return handleGETRequest();
    } else if (request.method === "OPTIONS") {
      return new Response("The request was an OPTIONS");
    } else {
      return new Response("The request was not a GET or a POST");
    }
    async function handlePOSTRequest() {
      const reqBody = JSON.stringify(await request.json());
      await kv.put("myKey", reqBody);

      return new Response(reqBody, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
    async function handleGETRequest() {
      const data = await kv.get("myKey", { type: "json" });

      const json = JSON.stringify(data);

      return new Response(json, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
  },
};
