const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 465,
    secure: true,
    auth: {
        user: "9596228b09e04b",
        pass: "233ad899a5454b"
    }
});

const smtp_config = async (object) => {

    await transporter.sendMail({
        from: `${object.email_client}`,
        to: `${object.email_fornecedor}`,
        subject: "Oferta aceita",
        text: "Um textocom as informações da solicitação e oferta"
    });

}

module.exports = {
    smtp_config
}