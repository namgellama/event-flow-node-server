export type EmailTemplate = {
    id: string;
    name: string;
    sender: string;
    subject: string;
    html: string;
    isReusable: boolean;
    createdAt: Date;
    updatedAt: Date;
};
