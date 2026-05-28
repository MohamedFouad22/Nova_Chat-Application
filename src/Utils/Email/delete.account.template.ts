export const DeleteAccountAlertTemplate = (
  firstName: string,
  subject: string,
) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>

<style>
body{
  margin:0;
  padding:0;
  background:#f1f5f9;
  font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
  width:100%;
  padding:50px 15px;
  background:
  radial-gradient(circle at 15% 20%, rgba(99,102,241,0.15), transparent 40%),
  radial-gradient(circle at 85% 10%, rgba(79,70,229,0.15), transparent 40%);
}

.container{
  max-width:620px;
  margin:auto;
  background:#ffffff;
  border-radius:14px;
  overflow:hidden;
  border:1px solid #e5e7eb;
  box-shadow:0 25px 45px rgba(0,0,0,0.08);
}

.header{
  background:linear-gradient(135deg,#4f46e5,#6366f1);
  padding:30px;
  text-align:center;
  color:#fff;
}

.header h1{
  margin:0;
  font-size:24px;
  letter-spacing:1px;
}

.body{
  padding:40px 35px;
  text-align:center;
  color:#374151;
  line-height:1.7;
}

.body h2{
  margin:0;
  font-size:22px;
}

.body p{
  margin:14px 0;
  font-size:15px;
  color:#6b7280;
}

.info-box{
  margin:30px 0;
  padding:25px;
  border-radius:12px;
  background:#f8fafc;
  border:1px solid #e0e7ff;
  font-size:16px;
  color:#374151;
}

.security-box{
  margin-top:30px;
  padding:18px;
  border-radius:10px;
  background:#fff1f2;
  border:1px solid #ffe4e6;
  font-size:14px;
  color:#9f1239;
}

.divider{
  width:100%;
  height:1px;
  background:#f1f5f9;
  margin:35px 0;
}

.footer{
  padding:30px;
  background:#f9fafb;
  text-align:center;
  font-size:13px;
  color:#9ca3af;
}

.brand{
  font-weight:bold;
  color:#6366f1;
}
</style>
</head>

<body>

<div class="wrapper">
  <div class="container">
    <div class="header">
      <h1>Account Deleted</h1>
    </div>

    <div class="body">
      <h2>Goodbye, ${firstName}</h2>

      <p>
        We're sending this email to confirm that your Chat Application account has been successfully deleted.
      </p>

      <div class="info-box">
        <strong>Action:</strong> Account Permanent Deletion<br>
        <strong>Date:</strong> ${new Date().toLocaleDateString()}
      </div>

      <p>
        All your personal data, messages, and settings have been removed from our active servers. We're sorry to see you go, and you're welcome back anytime!
      </p>

      <div class="divider"></div>

      <div class="security-box">
        <strong>Didn't request this?</strong><br>
        If you did not delete your account, please contact our security team immediately. Note that once an account is fully deleted, it may not be recoverable.
      </div>
    </div>

    <div class="footer">
      <p class="brand">Chat Application Platform</p>
      <p>Thank you for being part of our community</p>
      <p>© 2026 All rights reserved</p>
    </div>
  </div>
</div>

</body>
</html>`;
