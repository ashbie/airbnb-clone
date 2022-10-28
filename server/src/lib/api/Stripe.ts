import stripe from "stripe";

const client =  new stripe(`${process.env.S_SECRET_KEY}`,{
    apiVersion: "2022-08-01",
  });

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({ 
      grant_type: "authorization_code",
      code
    });

    return response;
  }
};
