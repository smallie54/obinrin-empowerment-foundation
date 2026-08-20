import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import Admin from "../models/Admin.js";
import { sendEmail } from "../config/mailer.js";

function signToken(admin) {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function createAdmin(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await Admin.hashPassword(password);
    const admin = await Admin.create({
      name,
      email,
      passwordHash,
      role: role === "superadmin" ? "superadmin" : "admin",
    });
    let emailSent = true;
    try {
      const loginUrl = `${(process.env.CLIENT_URL || "").split(",")[0].trim()}/admin/login`;

      await sendEmail({
        to: email,
        subject: "Your Obinrin Empowerment Foundation admin account",
        html: `
          <p>Hi ${name},</p>
          <p>An admin account has been created for you on the Obinrin Empowerment Foundation dashboard.</p>
          <p>
            <strong>Email:</strong> ${email}<br/>
            <strong>Temporary password:</strong> ${password}
          </p>
          <p>
            Log in here: <a href="${loginUrl}">${loginUrl}</a>
          </p>
          <p>
            For security, please change your password after logging in
            (Settings → Password), and consider enabling two-factor
            authentication for extra protection on your account.
          </p>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send new-admin email:", emailErr.message);
      emailSent = false;
    }

    res.status(201).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      emailSent,
    });
  } catch (err) {
    next(err);
  }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+twoFactorSecret");
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (admin.twoFactorEnabled) {
      const pendingToken = jwt.sign(
        { id: admin._id, stage: "pending2FA" },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );
      return res.json({ requiresTwoFactor: true, pendingToken });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    res.json({ token: signToken(admin), admin: publicAdmin(admin) });
  } catch (err) {
    next(err);
  }
}


export async function verifyTwoFactor(req, res, next) {
  try {
    const { pendingToken, code } = req.body;

    const payload = jwt.verify(pendingToken, process.env.JWT_SECRET);
    if (payload.stage !== "pending2FA") {
      return res.status(400).json({ message: "Invalid session" });
    }

    const admin = await Admin.findById(payload.id).select("+twoFactorSecret");
    if (!admin) return res.status(401).json({ message: "Not authenticated" });

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ message: "Invalid 2FA code" });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    res.json({ token: signToken(admin), admin: publicAdmin(admin) });
  } catch (err) {
    next(err);
  }
}


export async function setupTwoFactor(req, res, next) {
  try {
    const secret = speakeasy.generateSecret({
      name: `${process.env.TWO_FACTOR_APP_NAME} (${req.admin.email})`,
    });

    req.admin.twoFactorSecret = secret.base32;
    await req.admin.save();

    const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ qrDataUrl, manualEntryKey: secret.base32 });
  } catch (err) {
    next(err);
  }
}

export async function enableTwoFactor(req, res, next) {
  try {
    const { code } = req.body;
    const admin = await Admin.findById(req.admin._id).select("+twoFactorSecret");

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid code" });
    }

    admin.twoFactorEnabled = true;
    await admin.save();

    res.json({ message: "Two-factor authentication enabled" });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json(publicAdmin(req.admin));
}

export async function updateProfile(req, res, next) {
  try {
    const { name } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (name) admin.name = name;
    await admin.save();
    res.json(publicAdmin(admin));
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select("+passwordHash");
    const valid = await admin.comparePassword(currentPassword);
    if (!valid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    admin.passwordHash = await Admin.hashPassword(newPassword);
    await admin.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
}

export async function listAdmins(req, res, next) {
  try {
    const admins = await Admin.find().select("-passwordHash -twoFactorSecret");
    res.json(admins);
  } catch (err) {
    next(err);
  }
}

function publicAdmin(admin) {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    twoFactorEnabled: admin.twoFactorEnabled,
  };
}