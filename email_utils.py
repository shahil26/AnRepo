# app/auth/email_utils.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart, MIMEBase
import logging
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
import random
import mimetypes


load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_TO_US = os.getenv("EMAIL_TO_US")
# print(SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, EMAIL_FROM, EMAIL_TO_US)

def create_otp(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

def send_otp_email(email_to: str):
    """Sends an OTP email and returns the OTP if successful, otherwise None."""
    otp = create_otp()
    
    try:
        # Create Email
        msg = MIMEMultipart()
        msg["From"] = EMAIL_FROM
        msg["To"] = email_to
        msg["Subject"] = "OTP to Reset Password"
        body = f"Your OTP code is: {otp}"
        msg.attach(MIMEText(body, "plain"))

        # Connect to SMTP Server
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, email_to, msg.as_string())

        print(f"✅ OTP sent successfully to {email_to}")  # Debugging

        return otp  # Return OTP if email is sent

    except smtplib.SMTPAuthenticationError:
        logging.error("❌ Authentication failed. Check SMTP_USERNAME and SMTP_PASSWORD.")
    except smtplib.SMTPConnectError:
        logging.error("❌ Failed to connect to the SMTP server.")
    except smtplib.SMTPException as e:
        logging.error(f"❌ SMTP error occurred: {e}")
    except Exception as e:
        logging.error(f"❌ Unexpected error: {e}")

    return None  # Return None if email sending failed
def send_contact_us_email(email: str, phone: str, institute: str):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_FROM
    msg["To"] = EMAIL_TO_US
    msg["Subject"] = "Contact Us"
    body = f"Email: {email}\nPhone: {phone}\nInstitute: {institute}"
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.connect(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(EMAIL_FROM, EMAIL_TO_US, msg.as_string())
        server.quit()

# def send_contact_us_email_files(email_from, subject, details, supportingFiles):
#     msg = MIMEMultipart()
#     msg["From"] = email_from
#     msg["To"] = EMAIL_TO_US
#     msg["Subject"] = subject
#     msg.attach(MIMEText(details, "plain"))

#     try:
#         # Attach files
#         for file in supportingFiles or []:
#             content = file["content"]
#             filename = file["filename"]

#             # Create a MIMEApplication for binary attachments
#             part = MIMEApplication(content, Name=filename)
#             part["Content-Disposition"] = f'attachment; filename="{filename}"'
#             msg.attach(part)

#     except Exception as e:
#         return {"status": "500", "data": {}, "message": f"Error processing files: {str(e)}"}

#     try:
#         # Send the email
#         with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
#             server.starttls()
#             server.login(SMTP_USERNAME, SMTP_PASSWORD)
#             server.sendmail(email_from, EMAIL_TO_US, msg.as_string())
#         return {"status": "200", "message": "Email sent successfully"}
#     except Exception as e:
#         return {"status": "500", "message": f"Error sending email: {str(e)}"}

def send_contact_us_email_files(email_from: str, subject: str, body: str, filename: str=None, file_content: bytes=None):
    """Send an email with the provided subject, body, and file attachment."""
    msg = MIMEMultipart()
    msg['From'] = email_from
    msg['To'] = EMAIL_TO_US
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    if file_content:
        mime_type, _ = mimetypes.guess_type(filename)
        if mime_type is None:
            mime_type = "application/octet-stream"
        main_type, sub_type = mime_type.split('/')

        part = MIMEBase(main_type, sub_type)
        part.set_payload(file_content)
        encoders.encode_base64(part)
    else:
        part = MIMEText(body, 'plain')

    if filename:
        part.add_header('Content-Disposition', f'attachment; filename="Attachment"')
    else:
        part.add_header('Content-Disposition', 'attachment')
    msg.attach(part)

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(email_from, EMAIL_TO_US, msg.as_string())
        print("Email sent!")