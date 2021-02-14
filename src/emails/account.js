const sgMail=require('@sendgrid/mail');

sgMail.setApiKey(process.env.key);
const welcome=(name,password)=>{

    sgMail.send({
        from:'prem.panwala@bacancy.com',
        to:name,
        subject:'Thanks For Joining!!',
        text:`Hello,${name}. Welcome you to great journy with you `
    })
}

const cancel=(name,password)=>{
console.log('cancel method called')
    sgMail.send({
        from:'prem.panwala@bacancy.com',
        to:name,
        subject:'LEAVING CONFIRMATION',
        text:`Hello,${name}. It's Been great journey with you.hope to see you soon `
    })
}


module.exports={welcome,cancel}
