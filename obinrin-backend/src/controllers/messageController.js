// controllers/messageController.js - Updated

export async function listRecentMessages(req, res, next) {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('sentBy', 'name email')
      .lean(); // Use .lean() for plain JavaScript objects

    // Always return an array, even if empty
    return res.json({
      success: true,
      data: messages || [], // Ensure it's always an array
      count: messages.length
    });
  } catch (err) {
    console.error('List recent messages error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
      data: [] // Return empty array on error
    });
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
        .populate('sentBy', 'name email')
        .lean(), // Use .lean() for better performance
      Message.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: messages || [], // Ensure it's always an array
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('List messages error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
      data: [] // Return empty array on error
    });
  }
}