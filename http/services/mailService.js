import dotenv from "dotenv";
import nodemailer from "nodemailer";


dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SENDER_MAIL_ADDRESS = process.env.SENDER_MAIL_ADDRESS;
const SENDER_SMTP_PASSWORD = process.env.SENDER_SMTP_PASSWORD;
const API_URL = process.env.API_URL;


class MailService {
    transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,   // TRUE - for 465 port, FALSE - for other ports
            auth: {
                user: SENDER_MAIL_ADDRESS,
                pass: SENDER_SMTP_PASSWORD
            }
        });
    }

    sendActivationMessage = async (to, link) => {
        await this.transporter.sendMail({
            from: SENDER_MAIL_ADDRESS,
            to: to,
            subject: `Activating a ${API_URL} account`,
            text: "",
            html: `
                <div>
                    <h1>Follow the link to activate your account</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

export default MailService