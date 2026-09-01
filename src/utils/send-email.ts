import { CreateEmailOptions } from "resend";
import { resend } from "../config/resend";

export async function sendEmail(payload: CreateEmailOptions) {
    return await resend.emails.send(payload);
}
