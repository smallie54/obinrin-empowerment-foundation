// controllers/messageController.js
export async function sendThankYouMessage(req, res, next) {
  try {
    const { donorEmail, donorName, channel, subject, body } = req.body;

    // Validate required fields
    if (!donorEmail || !donorName || !channel || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['donorEmail', 'donorName', 'channel', 'body']
      });
    }

    if (channel === "sms") {
      const message = await Message.create({
        donorName,
        donorEmail,
        channel,
        subject,
        body,
        status: "pending",
        sentBy: req.admin._id,
      });
      return res.json({
        message: "SMS provider not connected yet — saved as pending.",
        record: message,
      });
    }

    // Email channel
    if (channel !== "email") {
      return res.status(400).json({
        error: 'Invalid channel. Must be "email" or "sms"'
      });
    }

    try {
      // Send email - support both text and html
      const emailResult = await sendEmail({ 
        to: donorEmail, 
        subject: subject || 'Thank You for Your Donation', 
        text: body,
        html: body // If body contains HTML
      });

      const message = await Message.create({
        donorName,
        donorEmail,
        channel,
        subject: subject || 'Thank You for Your Donation',
        body,
        status: "sent",
        sentBy: req.admin._id,
      });

      return res.status(200).json({ 
        success: true,
        message: "Email sent successfully!", 
        record: message,
        emailId: emailResult.messageId || emailResult.id
      });
    } catch (emailErr) {
      // Log the actual error
      console.error('Email send error:', {
        error: emailErr.message,
        stack: emailErr.stack,
        to: donorEmail,
        subject
      });

      // Save failed attempt
      await Message.create({
        donorName,
        donorEmail,
        channel,
        subject,
        body,
        status: "failed",
        sentBy: req.admin._id,
        error: emailErr.message // Add error field to schema
      });

      // Return specific error
      return res.status(500).json({
        error: 'Failed to send email',
        details: emailErr.message
      });
    }
  } catch (err) {
    console.error('Controller error:', err);
    next(err);
  }
}