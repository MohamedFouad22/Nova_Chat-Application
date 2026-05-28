export const PasswordChangeTemplate = (
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
  radial-gradient(circle at 15% 20%, rgba(239,68,68,0.05), transparent 40%),
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

.alert-box{
  margin:30px 0;
  padding:25px;
  border-radius:12px;
  background:#fff7ed;
  border:1px solid #ffedd5;
  font-size:16px;
  color:#9a3412;
}

.security-box{
  margin-top:30px;
  padding:18px;
  border-radius:10px;
  background:#f9fafb;
  border:1px solid #e5e7eb;
  font-size:14px;
  color:#6b7280;
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

.warning-text {
  color: #ef4444;
  font-weight: bold;
}
</style>
</head>

<body>

<div class="wrapper">
  <div class="container">
    <div class="header">
      <h1>Security Notification</h1>
    </div>

    <div class="body">
      <h2>Hello ${firstName}</h2>

      <p>
        This is an automated security notification regarding your account.
      </p>

      <div class="alert-box">
        <strong>${subject}</strong><br>
        Your account password was successfully changed on <strong>${new Date().toLocaleString()}</strong>.
      </div>

      <p>
        If this was you, you can safely ignore this email. No further action is required.
      </p>

      <div class="divider"></div>

      <div class="security-box">
        <span class="warning-text">Did not make this change?</span><br>
        If you did not authorize this change, please contact our support team immediately or reset your password to secure your account.
      </div>
    </div>

    <div class="footer">
      <p class="brand">Chat Application Platform</p>
      <p>Securing your online presence</p>
      <p>© 2026 All rights reserved</p>
    </div>
  </div>
</div>

</body>
</html>`;
