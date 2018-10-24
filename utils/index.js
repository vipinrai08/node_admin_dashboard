var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

exports.sendMail = (data) => {

    if(data.template) {
        var template = hbs.compileFile(`../views/Auth/${data.template}.hbs`);
        var html = template(data.message);
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eamil',
            pass: 'pass'
        }
    });

    var mailOptions = {
        from: `"TecHindustan" <${data.from}>` || 'reply.vipinrai@gmail.com',
        to: data.to,
        subject: data.subject,
        html: !data.template?data.message:html 
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.verifyToken = (token, res, callback) => {
    jwt.verify(token, 'my-secret', (error, response) => {
		if(error) {
			return res.status(400).json({
				message: 'Invalid Token.'
			});
        }

        callback(response);
    })
}