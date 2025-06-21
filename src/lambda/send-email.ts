import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

export const handler = async (event: any) => {
    const toAddress = event.to;
    const subject = event.subject;
    const bodyText = event.body;

    const params = {
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Text: { Data: bodyText },
            },
            Subject: { Data: subject },
        },
        Source: process.env.SENDER_EMAIL!,
    };

    try {
        const command = new SendEmailCommand(params);
        await sesClient.send(command);
        return { statusCode: 200, body: "Email sent" };
    } catch (err) {
        console.error("Error sending email", err);
        return { statusCode: 500, body: "Failed to send email" };
    }
};
