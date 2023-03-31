import transporter from '../config/nodemailer.config.js';

const sendEmail = async (
    mail: string,
    subject: string,
    html: string
): Promise<void> => {
    const mailOptions = {
        from: 'base-app-ts',
        to: mail,
        subject,
        text: '',
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('email sent');
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;
