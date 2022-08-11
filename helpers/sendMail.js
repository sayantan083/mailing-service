const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

module.exports = {
  sendMail: async (data) =>{

    let info = await transporter.sendMail({
        from: '"Sayantan Panda 👻" <sayantan083@gmail.com>',
        to: data.emails,
        subject: "Want to make you smile",
        html: `<div>
          <h4>Hey there! Here is your daily digest of dad jokes😉</h4>
          <p>${data.setup}</p>
          <p>${data.punchline}</p>
        </div>`,
    });

    console.log("Message sent: %s", info.messageId);
  }
}