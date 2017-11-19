var Connects = require('./server/models/connects');
var nodemailer = require('nodemailer');

 module.exports = function (input,callback) {
     //post방식으로 받아온 json타입에서 바디의 iotaction key의 data값을 string으로 받아옴
     // iotaction: xx
     var result='';
     var input_n = input;
    //json 배열 형태로 뽑아내 전달

    Connects.find({input_number: input_n},{_id: 0, output_number: 1,email: 1,emailaddr: 1,emailtext: 1}) // id컬럼값을제거하고 iotevent만 남김
    .sort('-created')
    .exec(function (error, connects) {
      console.log('data: ' + connects);
      let outputs = (connects);
      let emailCheck = outputs.find((item, idx) => {
        return item.email === '1'
      });
      if(outputs[0] != undefined){
      result = outputs[0].output_number;
        }
      else{
        result=' ';
      }

      if(emailCheck){
        var transporter = nodemailer.createTransport({
        service: "naver",
        auth: {
                user: "zx6658@naver.com",
                pass: "as960920!!"
          }
        });
        var mailOptions = {
          from: "zx6658@naver.com",
          to: outputs[0].emailaddr,
          subject: "Do IoT Yourself" + outputs[0].emailtext,
          text: outputs[0].emailtext
          };

        transporter.sendMail(mailOptions, function(error, response)
        {
          if(error){ console.log(error);
          }
          else{
            console.log("Message sent: " + response.message);
          }
          transporter.close();


        });
        }

        callback(result);
    });

};
