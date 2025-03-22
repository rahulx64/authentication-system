
import { VERIFICATION_EMAIL_TEMPLATE ,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailtemplates.js";
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
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
      });

      console.log("email sent succesfully",response);
    }
    catch(e)
    {
            console.log("error sending verification email",e.message);
            throw new Error(`Verification email not sent ${e.message}`);
    }
     
};

export const sendwelcomeemail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapclient.send({
      from: mailtrapsender,
      to: recipient,
      subject: "welcome email",
      text: `welcome back my friend ${name}`,
      category: "welcome email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        name
      ),
    });

    console.log("welcome email sent succesfully", response);
  } catch (e) {
    console.log("error sending verification email", e.message);
    throw new Error(`Verification email not sent ${e.message}`);
  }
};

export const sendpasswordresetemail=async (email,reseturl)=>{
 const recipient=[{email}];
  try {
    const response = await mailtrapclient.send({
      from: mailtrapsender,
      to: recipient,
      subject: "Password reset request",
      category: "reset password  email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", reseturl),
    });

    console.log("reset password email sent succesfully", response);
  } catch (e) {
    console.log("error sending password reset email", e.message);
    throw new Error(`password verfification  email not sent ${e.message}`);
  }   
 

}


export const sendresetsuccessemail=async (email)=>{
  const recipient=[{email}];
  try {
    const response = await mailtrapclient.send({
      from: mailtrapsender,
      to: recipient,
      subject: "Password reset succesful",
      category: "reset password  email success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("reset password email sent succesfully", response);
  } catch (e) {
    console.log("error sending password reset email", e.message);
    throw new Error(`password verfification  email not sent ${e.message}`);
  }
 

}

