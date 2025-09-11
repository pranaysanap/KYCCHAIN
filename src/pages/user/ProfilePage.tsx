import React, { useEffect, useMemo, useState } from 'react';
import { Camera, User, Shield, Lock, LogOut, Save, X, Globe, Bell, Laptop2, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import { getProfile, updateProfile, updatePreferences, updatePassword, logoutSession, deactivateAccount, deleteAccount } from '../../services/mockApi';

type Prefs = {
  theme: 'dark' | 'light';
  emailAlerts: boolean;
  fraudAlerts: boolean;
  language: string;
};

const neonBadge = (text: string, color: 'green' | 'red' | 'yellow' | 'blue') => {
  const map: any = {
    green: 'bg-green-900/40 text-green-300 border border-green-700/40',
    red: 'bg-red-900/40 text-red-300 border border-red-700/40',
    yellow: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
    blue: 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${map[color]}`}>{text}</span>;
};

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [prefs, setPrefs] = useState<Prefs>({ theme: 'dark', emailAlerts: true, fraudAlerts: true, language: 'en' });
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [confirmModal, setConfirmModal] = useState<null | { action: 'deactivate' | 'delete'; text: string }>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setForm(data.user);
        setPrefs(data.preferences);
      } catch (e) {
        setToast({ type: 'error', message: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const activityPaged = useMemo(() => {
    const items = profile?.activity || [];
    return items.slice(0, 10);
  }, [profile]);

  const saveProfile = async () => {
    try {
      const updated = await updateProfile({ fullName: form.fullName, email: form.email, phone: form.phone, address: form.address });
      setProfile((p: any) => ({ ...p, user: updated }));
      setEditing(false);
      setToast({ type: 'success', message: 'Profile updated' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to update profile' });
    }
  };

  const savePrefs = async () => {
    try {
      const updated = await updatePreferences(prefs);
      setProfile((p: any) => ({ ...p, preferences: updated }));
      setToast({ type: 'success', message: 'Preferences saved' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to save preferences' });
    }
  };

  const changePassword = async () => {
    try {
      await updatePassword(pwd.current, pwd.next, pwd.confirm);
      setPwd({ current: '', next: '', confirm: '' });
      setToast({ type: 'success', message: 'Password updated' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to update password' });
    }
  };

  const logoutDevice = async (id: string) => {
    try {
      await logoutSession(id);
      setProfile((p: any) => ({ ...p, security: { ...p.security, sessions: p.security.sessions.filter((s: any) => s.id !== id) } }));
      setToast({ type: 'success', message: 'Device logged out' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to logout device' });
    }
  };

  const confirmDanger = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.action === 'deactivate') await deactivateAccount();
      if (confirmModal.action === 'delete') await deleteAccount();
      setConfirmModal(null);
      setToast({ type: 'success', message: 'Action completed' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Action failed' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-300">Loading profile...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-gray-300">Manage your account, security, and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-600 neon-glow-blue flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-gray-800 border border-gray-700 rounded-full p-2 hover:bg-gray-700" aria-label="Edit avatar">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <p className="text-white font-semibold">{profile.user.fullName}</p>
              <p className="text-gray-400 text-sm">{profile.user.email}</p>
              <div className="mt-1">{neonBadge('User', 'blue')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Profile Information</h3>
          </div>
          {!editing ? (
            <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="secondary" onClick={() => { setEditing(false); setForm(profile.user); }}>Cancel</Button>
              <Button variant="success" onClick={saveProfile}><Save className="w-4 h-4 mr-1" /> Save</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['fullName','email','phone','address','role'].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              {editing && field !== 'role' ? (
                <input
                  value={(form as any)[field] || ''}
                  onChange={e => setForm((f: any) => ({ ...f, [field]: e.target.value }))}
                  className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800 text-white">
                  {(profile.user as any)[field]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Security Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 font-medium mb-2">Change Password</p>
            <div className="space-y-2">
              <input type="password" placeholder="Current password" value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} className="w-full bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <input type="password" placeholder="New password" value={pwd.next} onChange={e => setPwd({ ...pwd, next: e.target.value })} className="w-full bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <input type="password" placeholder="Confirm new password" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} className="w-full bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <Button variant="primary" onClick={changePassword}>Update Password</Button>
            </div>
          </div>

          <div>
            <p className="text-gray-300 font-medium mb-2">Two-Factor Authentication</p>
            <label className="inline-flex items-center space-x-2 text-sm text-gray-300">
              <input type="checkbox" checked={profile.security.twoFactorEnabled} onChange={() => setProfile((p: any) => ({ ...p, security: { ...p.security, twoFactorEnabled: !p.security.twoFactorEnabled } }))} />
              <span>Enable 2FA</span>
            </label>

            <p className="text-gray-300 font-medium mt-6 mb-2">Active Sessions</p>
            <div className="space-y-2">
              {profile.security.sessions.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                  <div className="text-sm text-gray-300">
                    <div className="font-medium text-white">{s.device}</div>
                    <div className="text-gray-400">{s.location} • {s.ip}</div>
                    <div className="text-gray-500 text-xs">Last active: {new Date(s.lastActive).toLocaleString()}</div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => logoutDevice(s.id)}><LogOut className="w-4 h-4 mr-1" /> Log Out Device</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Laptop2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
            <span className="text-sm text-gray-300">Theme (Dark/Light)</span>
            <input type="checkbox" checked={prefs.theme === 'dark'} onChange={() => setPrefs(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))} />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
            <span className="text-sm text-gray-300">Email Alerts</span>
            <input type="checkbox" checked={prefs.emailAlerts} onChange={e => setPrefs(p => ({ ...p, emailAlerts: e.target.checked }))} />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
            <span className="text-sm text-gray-300">Fraud Alerts</span>
            <input type="checkbox" checked={prefs.fraudAlerts} onChange={e => setPrefs(p => ({ ...p, fraudAlerts: e.target.checked }))} />
          </label>
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Globe className="w-4 h-4" />
            <select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))} className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <Button variant="success" onClick={savePrefs}><Bell className="w-4 h-4 mr-1" /> Save Preferences</Button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Activity Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {activityPaged.map((a: any) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 text-gray-300">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 text-white">{a.action}</td>
                  <td className="px-6 py-4">{a.status === 'success' ? neonBadge('Success', 'green') : a.status === 'failed' ? neonBadge('Failed', 'red') : neonBadge('Pending', 'yellow')}</td>
                  <td className="px-6 py-4 text-gray-300">{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glassmorphism rounded-xl p-6 border border-red-700/40" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.25)' }}>
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-white font-semibold">Danger Zone</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Button variant="warning" onClick={() => setConfirmModal({ action: 'deactivate', text: 'Are you sure you want to deactivate your account?' })}>Deactivate Account</Button>
          <Button variant="danger" onClick={() => setConfirmModal({ action: 'delete', text: 'This will permanently delete your account and data. Continue?' })}>Delete Account Permanently</Button>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => setConfirmModal(null)}></div>
          <div role="dialog" aria-modal="true" aria-label="Confirm Action" className="relative glassmorphism rounded-xl p-6 w-full max-w-md">
            <h4 className="text-white text-lg font-semibold mb-3">Confirm</h4>
            <p className="text-gray-300 mb-6">{confirmModal.text}</p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setConfirmModal(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
              <Button variant={confirmModal.action === 'delete' ? 'danger' : 'warning'} onClick={confirmDanger}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg glassmorphism border ${
            toast.type === 'success' ? 'border-green-700/40 text-green-300' : 'border-red-700/40 text-red-300'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;


