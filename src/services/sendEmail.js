import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../lib/sesClient.js";

const createSendEmailCommand = (fromAddress, toAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        process.env.NEXT_PUBLIC_RECIPIENT_EMAIL
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "Hello from SDK!",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hello from SDK!",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Test Email from SDK",
      },
    },
    Source: process.env.NEXT_PUBLIC_SENDER_EMAIL,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

export const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    process.env.NEXT_PUBLIC_RECIPIENT_EMAIL,
    process.env.NEXT_PUBLIC_SENDER_EMAIL
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};