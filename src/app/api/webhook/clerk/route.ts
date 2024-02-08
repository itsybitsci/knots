// Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// Above article shows why we need webhooks i.e., to sync data to our backend

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it
import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import { updateUser } from "@/lib/actions/user.actions";

// Resource: https://clerk.com/docs/integration/webhooks#supported-events
// Above document lists the supported events
type EventType =
	| "user.updated";

type Event = {
	data: Record<string, string | number | Record<string, string>[]>;
	object: "event";
	type: EventType;
};

export const POST = async (request: Request) => {
	const payload = await request.json();
	const header = headers();

	const heads = {
		"svix-id": header.get("svix-id"),
		"svix-timestamp": header.get("svix-timestamp"),
		"svix-signature": header.get("svix-signature"),
	};

	const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET!);

	let evnt: Event | null = null;

	try {
		evnt = wh.verify(
			JSON.stringify(payload),
			heads as IncomingHttpHeaders & WebhookRequiredHeaders
		) as Event;
	} catch (err) {
		return NextResponse.json({ message: err }, { status: 400 });
	}

	const eventType: EventType = evnt?.type!;

	if (eventType === "user.updated") {
		try {
			const { id, primary_email_address_id, email_addresses, image_url, first_name, last_name, username } = evnt?.data ?? {};

			let email_address: string = '';
			if (Array.isArray(email_addresses)) {
				for (const email of email_addresses) {
					if (email.id === primary_email_address_id) {
						email_address = email.email_address;
					}
				}
			}

			await updateUser({
				userId: id as string,
				username: username as string,
				first_name: first_name as string,
				last_name: last_name as string,
				email_address: email_address,
				imageUrl: image_url as string
			});

			return NextResponse.json({ message: "User updated" }, { status: 201 });
		} catch (err) {
			console.log(err);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
};