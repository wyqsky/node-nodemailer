var fs = require('fs');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var scanf = require('scanf');
var program = require('commander');

var config = {};
program.version('0.0.1').option('-r, --rewrite', 'rewrite config').parse(process.argv);

fs.readFile('config.json', 'utf-8', function(err, data) {
	if(err || !data || program.rewrite){
		console.log('输入邮箱(如:123456789@qq.com):');
		config.your_mail = scanf('%s');

		console.log('输入邮箱授权码:');
		config.mail_pass = scanf('%s');

		console.log('输入收件人邮箱(如果与上面的邮箱一致请直接回车):');
		config.receive_mail = scanf('%s');

		fs.writeFile('config.json',JSON.stringify(config));
	} else {
		config = JSON.parse(data);
	}

	var transporter = nodemailer.createTransport({
        host: "smtp.qq.com", //邮箱的服务器地址，
        secureConnection: true,
        port: 465, //端口
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: config.your_mail, // 邮箱账号
            pass: config.mail_pass, // 邮箱授权
        }
    });

    var mailOptions = {
        from: config.your_mail, // 发件邮箱地址
        to: config.receive_mail || config.your_mail, // 收件邮箱地址，可以和发件邮箱一样
        subject: '邮件标题', //
        html: '<p>可以添加html文本</p>' // html body 也可以用text文本
        // 下面是发送附件，不需要就注释掉
        // attachments: [{
        //        filename: 'fujian.txt',`
        //        path: './fujian.txt'
        //    },{
        //        filename: 'content',
        //        content: '发送内容'
        //    }]
    };

    // 发邮件部分
    function sendemail() {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('--------------------------------------------------');
            console.log(' 邮件已发送: ' + mailOptions.to);
            console.log('--------------------------------------------------');
        });
    }
    sendemail();

    // 确定时间，例如：2012年11月21日，5:30
    function _time(){
		var date = new Date(2012, 11, 21, 5, 30, 0);
    }
    // 每小时的固定分钟，例如：每个小时的42分钟
    function hourTime(){
		var rule = new schedule.RecurrenceRule();
		rule.minute = 42;
    }
    // 一个星期中的某些天的某个时刻，例如：每周四，周五，周六，周天的17点
    function weekTime(){
    	var rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = [0, new schedule.Range(4, 6)];
		rule.hour = 17;
		rule.minute = 0;
    }

    // 定时发送
    // var rule = new schedule.RecurrenceRule();　　
    // rule.second = [0, 10, 20, 30, 40, 50];
    // var c = 0;　　
    // var j = schedule.scheduleJob(rule, function() {
    //     c++;
    //     console.log(c);
    //     // sendemail();
    // });

})





