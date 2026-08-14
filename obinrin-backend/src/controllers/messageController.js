// controllers/messageController.js
import Message from "../models/message.js";
import { generateThankYouDraft } from "../config/groqServices.js";
import { sendEmail } from "../config/mailer.js";

export async function draftThankYouMessage(req, res, next) {
  try {
    const { donorName, amount, currency, channel } = req.body;
    
    // Validate required fields
    if (!donorName) {
      return res.status(400).json({
        error: 'Missing required field: donorName'
      });
    }

    const draft = await generateThankYouDraft({ 
      donorName, 
      amount, 
      currency, 
      channel 
    });
    
    res.json({ 
      success: true,
      draft 
    });
  } catch (err) {
    console.error('Draft generation error:', err);
    next(err);
  }
}

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

    // Handle SMS channel
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
        success: true,
        message: "SMS provider not connected yet — saved as pending.",
        record: message,
      });
    }

    // Handle Email channel
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

      // Save successful message
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
        error: emailErr.message
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

export async function listRecentMessages(req, res, next) {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('sentBy', 'name email'); // Populate admin info if needed

    res.json({
      success: true,
      messages
    });
  } catch (err) {
    console.error('List recent messages error:', err);
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const { status, channel, limit = 50, page = 1 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (channel) filter.channel = channel;

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('sentBy', 'name email'),
      Message.countDocuments(filter)
    ]);

    res.json({
      success: true,
      messages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('List messages error:', err);
    next(err);
  }
}