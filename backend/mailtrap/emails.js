
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailtemplates";
import { mailtrapclient,mailtrapsender } from "./mailtrap.config.js";


export const sendverificationemail = async (email, verificationToken) => {
    const recipient=[{email}];

    try{
      const response=await mailtrapclient.send({
        from:mailtrapsender,
        to:recipient,
        subject:"Verification email",
        text:`Your verification code is ${verificationToken}`,
        category:"Verification email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{{verificationCode}}",verificationToken),
      });
    }
    catch(e)
    {
            console.log("error sending verification email",e.message);
            throw new Error(`Verification email not sent ${e.message}`);
    }



     
};