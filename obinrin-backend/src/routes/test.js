// routes/test.js or add to your existing routes
router.get('/test-email', async (req, res) => {
  try {
    const result = await sendEmail({
      to: 'your-test-email@gmail.com',
      subject: 'Test Email from Your App',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<h1>Test</h1><p>This is a test email to verify SMTP configuration.</p>'
    });
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});