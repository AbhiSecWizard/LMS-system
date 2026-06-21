const { StandardCheckoutClient, Env }=require('@phonepe-pg/pg-sdk-node')
 
const clientId=process.env.PHONEPE_CLIENT_ID;
const clientSecret=process.env.PHONEPE_CLIENT_SECRET
const clientVersion=process.env.PHONEPE_CLIENT_VERSION;  //insert your client version here
const env =
  process.env.PHONEPE_ENV === "PRODUCTION"
    ? Env.PRODUCTION
    : Env.SANDBOX;//change to Env.PRODUCTION when you go live

const client=StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

module.exports = client




