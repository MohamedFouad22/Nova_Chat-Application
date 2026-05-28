export const DeleteAccountOTPTemplate = (
  code: number,
  firstName: string,
  subject: string,
) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>

<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  background:#f4f7fb;
  font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
  width:100%;
  padding:50px 15px;
  background:
    radial-gradient(circle at 10% 20%, rgba(239,68,68,0.08), transparent 35%),
    radial-gradient(circle at 90% 10%, rgba(99,102,241,0.12), transparent 35%);
}

.container{
  max-width:640px;
  margin:auto;
  background:#ffffff;
  border-radius:18px;
  overflow:hidden;
  border:1px solid #e5e7eb;
  box-shadow:0 20px 50px rgba(0,0,0,0.08);
}

.header{
  background:linear-gradient(135deg,#ef4444,#dc2626); /* لون أحمر للتنبيه */
  padding:35px 30px;
  text-align:center;
  color:#ffffff;
}

.header h1{
  font-size:26px;
  margin-bottom:8px;
  letter-spacing:0.5px;
}

.body{
  padding:45px 35px;
  text-align:center;
}

.body h2{
  font-size:24px;
  color:#111827;
  margin-bottom:15px;
}

.body p{
  font-size:15px;
  line-height:1.8;
  color:#6b7280;
  margin-bottom:14px;
}

.otp-section{
  margin:35px 0;
}

.otp{
  display:inline-block;
  padding:18px 40px;
  font-size:34px;
  font-weight:bold;
  letter-spacing:10px;
  color:#dc2626;
  background:#fef2f2;
  border:2px dashed #f87171;
  border-radius:14px;
}

.warning-box{
  margin-top:28px;
  padding:20px;
  border-radius:12px;
  background:#fff7ed;
  border:1px solid #ffedd5;
  text-align:left;
}

.warning-box p{
  margin:0;
  font-size:14px;
  color:#9a3412;
  line-height:1.6;
}

.divider{
  width:100%;
  height:1px;
  background:#eef2f7;
  margin:35px 0;
}

.footer{
  background:#f9fafb;
  padding:30px;
  text-align:center;
  border-top:1px solid #edf2f7;
}

.footer p{
  margin:6px 0;
  font-size:13px;
  color:#9ca3af;
}

.brand{
  font-size:15px;
  font-weight:bold;
  color:#4f46e5;
}
</style>
</head>

<body>

<div class="wrapper">
  <div class="container">

    <div class="header">
      <h1>${subject}</h1>
      <p>Security Verification Required</p>
    </div>

    <div class="body">
      <h2>Hello ${firstName}</h2>

      <p>
        We received a request to permanently delete your Chat Application account. 
        To confirm this action, please use the verification code below.
      </p>

      <div class="otp-section">
        <div class="otp">
          ${code}
        </div>
      </div>

      <div class="warning-box">
        <p>
          <strong>Warning:</strong> Deleting your account is permanent. All your messages, profile information, and data will be erased and cannot be recovered.
        </p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #9ca3af;">
        If you did not request to delete your account, please ignore this email and secure your account immediately.
      </p>

    </div>

    <div class="footer">
      <p class="brand">Chat Application</p>
      <p>© 2026 All rights reserved</p>
    </div>

  </div>
</div>

</body>
</html>`;
