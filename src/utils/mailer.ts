import nodemailer, {SendMailOptions} from 'nodemailer';
import log from "@/utils/logger";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    debug: true,
    auth: {
        user: 'emmyshoppinghub@gmail.com',
        pass: 'zbucjumcvlguwhaw'
    },
    tls: {
        rejectUnauthorized: true
    }
});

export default async function sendEmail(payload: SendMailOptions){
    transporter.sendMail(payload, (err, info) => {
        if(err){
            log.error(err, "Error sending mail");
            return;
        }

        console.log("Email sent")
        const messageURL = nodemailer.getTestMessageUrl(info);

        log.info(`Preview Url: ${payload.text}`);
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    })
}

// Verification code: 21HgIHG-nOtD4IMbO-a2Q, Id: 63cd33b29752e3a93aef06ec

// Preview Url: Verification code: OqA-VyTXDRHEIwgq51qnu, Id: 63cd36aaf72abbba3ecaf34a

// Preview Url: Password reset code: 9g6gEs2t6Vj8nTx12tlJg, ID: 63cd33b29752e3a93aef06ec