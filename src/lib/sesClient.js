import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
  
const sesClient = new SESClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
});
  
export { sesClient };