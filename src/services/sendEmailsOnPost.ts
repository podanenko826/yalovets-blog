import { ListTemplatesCommand, SendBulkTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../lib/sesClient";
import { PostItem, SubscriberItem } from "@/types/index";
import { getSubscribersByStatus } from "@/lib/subscribers";

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

export const sendEmailsOnPost = async (postData: PostItem): Promise<boolean> => {
    const sender = process.env.NEXT_PUBLIC_SENDER_EMAIL;
    if (!sender) throw new Error("Missing sender email");

    const templates = await sesClient.send(new ListTemplatesCommand({}));
    const templateNames = templates.TemplatesMetadata?.map(t => t.Name);
    if (!templateNames?.includes("ArticleBroadcast")) {
        throw new Error("SES template 'ArticleBroadcast' does not exist.");
    }

    const subscribedUsers: SubscriberItem[] = await getSubscribersByStatus("subscribed");

    if (!postData.slug) {
      postData.slug = `${postData.title
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replaceAll(' ', '-')
        .toLowerCase()}`;
    }

    const destinations = subscribedUsers.map(user => ({
        Destination: {
            ToAddresses: [user.email],
        },
        ReplacementTemplateData: JSON.stringify({
            name: user.name || "there",
            title: postData.title,
            description: postData.description,
            slug: postData.slug,
            email: user.email
        }),
    }));

    // Split into chunks of 50 (SES limit)
    const chunked = chunkArray(destinations, 50);

    for (const batch of chunked) {
        const command = new SendBulkTemplatedEmailCommand({
            Source: sender,
            Template: "ArticleBroadcast",
            Destinations: batch,
            DefaultTemplateData: JSON.stringify({
                name: "there",
                title: postData.title,
                description: postData.description,
                slug: postData.slug,
                email: ''
            }),
        });

        try {
            await sesClient.send(command);
            console.log(`Sent to batch of ${batch.length} users`);

            return true;
        } catch (err) {
            console.error("Error sending bulk email:", err);
        }
    }

    return false;
};