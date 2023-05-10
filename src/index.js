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
      const reqBody = await request.json();
      const wineryNumber = reqBody.wineryNumber;
      console.log(wineryNumber);
      const data = await getDataFromAPI(wineryNumber);

      await kv.put("myKey", JSON.stringify(data));

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
    async function getDataFromAPI(selectedWinery) {
      const response = await fetch(
        `https://api.apify.com/v2/datasets/XHxNIww6Ofj811blJ/items?offset=${selectedWinery}&limit=1`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json;charset=UTF-8",
            Authorization: `bearer ${env.ApifyToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data[0]);
      return data[0];
    }
  },
  async scheduled(event, env, ctx) {
    const kv = env.kv;
    const data = Number(await kv.get("countKey"));
    const newData = data + 1;
    await kv.put("countKey", newData);
  },
};
