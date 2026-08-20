import { useEffect, useState } from "react";
import { ShieldCheck, KeyRound, User, UserPlus } from "lucide-react";
import api from "../../admin/api/client";
import { useAdminAuth } from "../../admin/auth/AdminAuthContext";
import Modal from "../../admin/components/Modal";

const emptyAdminForm = { name: "", email: "", password: "", role: "admin" };

export default function Settings() {
  const { admin } = useAdminAuth();


  const [name, setName] = useState(admin?.name || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");


  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // 2FA
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [manualKey, setManualKey] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAMessage, setTwoFAMessage] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);

  // Admin roster (superadmin only)
  const [admins, setAdmins] = useState([]);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState(emptyAdminForm);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminFormError, setAdminFormError] = useState("");

  function loadAdmins() {
    api
      .get("/admin/auth/admins")
      .then((res) => setAdmins(res.data))
      .catch(() => {});
  }

  useEffect(() => {
    if (admin?.role === "superadmin") loadAdmins();
  }, [admin]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");
    try {
      await api.patch("/admin/auth/me", { name });
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileMessage(err.response?.data?.message || "Couldn't update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage("");
    try {
      await api.post("/admin/auth/change-password", { currentPassword, newPassword });
      setPasswordMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || "Couldn't change password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleSetupTwoFA() {
    setTwoFALoading(true);
    setTwoFAMessage("");
    try {
      const res = await api.post("/admin/auth/2fa/setup");
      setQrDataUrl(res.data.qrDataUrl);
      setManualKey(res.data.manualEntryKey);
    } catch (err) {
      setTwoFAMessage(err.response?.data?.message || "Couldn't start 2FA setup.");
    } finally {
      setTwoFALoading(false);
    }
  }

  async function handleEnableTwoFA(e) {
    e.preventDefault();
    setTwoFALoading(true);
    setTwoFAMessage("");
    try {
      await api.post("/admin/auth/2fa/enable", { code: twoFACode });
      setTwoFAMessage("Two-factor authentication enabled!");
      setQrDataUrl(null);
      setTwoFACode("");
    } catch (err) {
      setTwoFAMessage(err.response?.data?.message || "Invalid code.");
    } finally {
      setTwoFALoading(false);
    }
  }

  function openCreateAdmin() {
    setAdminForm(emptyAdminForm);
    setAdminFormError("");
    setAdminModalOpen(true);
  }

 async function handleCreateAdmin(e) {
  e.preventDefault();
  setAdminFormError("");
  setCreatingAdmin(true);
  try {
    const res = await api.post("/admin/auth/create", adminForm);
    setAdminModalOpen(false);
    setAdminForm(emptyAdminForm);
    loadAdmins();
    if (!res.data.emailSent) {
      setAdminFormError(
        "Admin created, but the notification email failed to send — share the password with them manually."
      );
    }
  } catch (err) {
    setAdminFormError(err.response?.data?.message || "Couldn't create admin.");
  } finally {
    setCreatingAdmin(false);
  }
}

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-heading font-bold text-2xl text-charcoal">Settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={17} className="text-purple" />
          <h3 className="font-heading font-bold text-charcoal">Profile</h3>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-3 max-w-sm">
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Email</label>
            <input
              disabled
              value={admin?.email || ""}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm bg-charcoal/5 text-charcoal/50"
            />
          </div>
          {profileMessage && <p className="text-xs text-charcoal/60">{profileMessage}</p>}
          <button
            type="submit"
            disabled={profileSaving}
            className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {profileSaving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={17} className="text-purple" />
          <h3 className="font-heading font-bold text-charcoal">Password</h3>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-sm">
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          {passwordMessage && <p className="text-xs text-charcoal/60">{passwordMessage}</p>}
          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {passwordSaving ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={17} className="text-purple" />
          <h3 className="font-heading font-bold text-charcoal">Two-Factor Authentication</h3>
          {admin?.twoFactorEnabled && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
              Enabled
            </span>
          )}
        </div>

        {admin?.twoFactorEnabled ? (
          <p className="text-sm text-charcoal/60">
            2FA is active on your account. Every login will ask for a code from your
            authenticator app.
          </p>
        ) : qrDataUrl ? (
          <form onSubmit={handleEnableTwoFA} className="space-y-3 max-w-sm">
            <p className="text-sm text-charcoal/60">
              Scan this QR code with Google Authenticator, Authy, or similar, then enter the
              6-digit code it shows.
            </p>
            <img src={qrDataUrl} alt="2FA QR code" className="w-40 h-40" />
            <p className="text-xs text-charcoal/40 break-all">
              Manual entry key: {manualKey}
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm text-center tracking-[0.4em] outline-none focus:border-purple"
            />
            {twoFAMessage && <p className="text-xs text-charcoal/60">{twoFAMessage}</p>}
            <button
              type="submit"
              disabled={twoFALoading || twoFACode.length !== 6}
              className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {twoFALoading ? "Verifying..." : "Enable 2FA"}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-sm text-charcoal/60 mb-3">
              Add an extra layer of security to your account.
            </p>
            {twoFAMessage && <p className="text-xs text-red-600 mb-2">{twoFAMessage}</p>}
            <button
              onClick={handleSetupTwoFA}
              disabled={twoFALoading}
              className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {twoFALoading ? "Loading..." : "Set Up 2FA"}
            </button>
          </div>
        )}
      </div>

      {/* Admin roster — superadmin only */}
      {admin?.role === "superadmin" && (
        <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-charcoal">Admin Accounts</h3>
            <button
              onClick={openCreateAdmin}
              className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
            >
              <UserPlus size={14} /> Add Admin
            </button>
          </div>
          <div className="space-y-2">
            {admins.map((a) => (
              <div key={a._id} className="flex items-center justify-between text-sm py-2 border-b border-charcoal/5 last:border-0">
                <div>
                  <p className="font-semibold text-charcoal">{a.name}</p>
                  <p className="text-xs text-charcoal/50">{a.email}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lavender text-purple capitalize">
                  {a.role}
                </span>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-sm text-charcoal/50">No other admins yet.</p>
            )}
          </div>
        </div>
      )}

      <Modal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} title="Add Admin">
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Name *</label>
            <input
              required
              value={adminForm.name}
              onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Email *</label>
            <input
              type="email"
              required
              value={adminForm.email}
              onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60">
              Temporary Password * <span className="text-charcoal/40">(min. 8 characters)</span>
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Role</label>
            <select
              value={adminForm.role}
              onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <p className="text-[11px] text-charcoal/40 mt-1">
              Superadmins can create other admin accounts and see this full roster.
            </p>
          </div>

          {adminFormError && <p className="text-xs text-red-600">{adminFormError}</p>}

          <button
            type="submit"
            disabled={creatingAdmin}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {creatingAdmin ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </Modal>
    </div>
  );
}