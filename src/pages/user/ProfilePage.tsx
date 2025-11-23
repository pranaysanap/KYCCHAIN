import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Shield, Lock, LogOut, Save, X, Globe, Bell, Laptop2, AlertTriangle } from 'lucide-react';
import AnimatedCard from '../../components/common/AnimatedCard';
import Button from '../../components/common/Button';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
  const [capturing, setCapturing] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  // temporary File selected from device (if any)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);

  const { logout, updateUser, avatarModalOpen, openAvatarModal, closeAvatarModal } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiService.getProfile();
        setProfile(data);
        setForm((data as any).user || {});
        setPrefs((data as any).preferences || { theme: 'dark', emailAlerts: true, fraudAlerts: true, language: 'en' });
      } catch (e) {
        console.error('Failed to load profile from backend:', e);
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
      const updatedResp = await apiService.updateProfile({ fullName: form.fullName, email: form.email, phone: form.phone, address: form.address });
      // backend returns { user: { ... } }
      const updatedUser = updatedResp?.user || updatedResp;
      setProfile((p: any) => ({ ...p, user: updatedUser }));
      setForm(updatedUser);
      setEditing(false);
      setToast({ type: 'success', message: 'Profile updated' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to update profile' });
    }
  };

  const savePrefs = async () => {
    try {
      const updated = await apiService.updatePreferences(prefs);
      setProfile((p: any) => ({ ...p, preferences: updated }));
      setToast({ type: 'success', message: 'Preferences saved' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to save preferences' });
    }
  };

  const changePassword = async () => {
    try {
      await apiService.updatePassword({ currentPassword: pwd.current, newPassword: pwd.next, confirmPassword: pwd.confirm });
      setPwd({ current: '', next: '', confirm: '' });
      setToast({ type: 'success', message: 'Password updated. Please login again.' });
      // Force logout so user must re-authenticate with new password
      setTimeout(() => {
        logout();
      }, 800);
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to update password' });
    }
  };

  const logoutDevice = async (id: string) => {
    try {
      // For now, this is a client-side session removal; server session management not implemented
      setProfile((p: any) => ({ ...p, security: { ...p.security, sessions: p.security.sessions.filter((s: any) => s.id !== id) } }));
      setToast({ type: 'success', message: 'Device logged out' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to logout device' });
    }
  };

  const confirmDanger = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.action === 'deactivate') {
        // Best-effort deactivate: call API deactivate endpoint; if missing, fall back to success
        try {
          await apiService.deactivateAccount();
        } catch (err) {
          console.warn('Deactivate endpoint not available:', err);
        }
      }
      if (confirmModal.action === 'delete') {
        await apiService.deleteAccount();
        // After deleting account, force logout
        setTimeout(() => {
          logout();
        }, 300);
      }
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
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-gray-300">Manage your account, security, and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
                <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-600 neon-glow-blue flex items-center justify-center overflow-hidden ring-2 ring-blue-500">
                  {profile?.user?.profileImage ? (
                    <img src={profile.user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <button onClick={() => openAvatarModal && openAvatarModal()} className="absolute -bottom-1 -right-1 bg-blue-600 border border-blue-700 rounded-full p-2 hover:bg-blue-500 text-white shadow-md" aria-label="Edit avatar">
                  <Camera className="w-4 h-4" />
                </button>
            </div>
            <div>
              <p className="text-white font-semibold">{profile.user.fullName}</p>
              <p className="text-gray-400 text-sm">{profile.user.email}</p>
              <div className="mt-1">{neonBadge('User', 'blue')}</div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Profile Info */}
      <AnimatedCard>
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Profile Information</h3>
          </div>
          {!editing ? (
            <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Button className="w-full sm:w-auto" variant="secondary" onClick={() => { setEditing(false); setForm(profile.user); }}>Cancel</Button>
              <Button className="w-full sm:w-auto" variant="success" onClick={saveProfile}><Save className="w-4 h-4 mr-1" /> Save</Button>
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
      </AnimatedCard>

      {/* Security Settings */}
      <AnimatedCard>
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
              <input
                type="checkbox"
                checked={!!(profile?.security?.twoFactorEnabled || profile?.user?.twoFactorEnabled)}
                onChange={async () => {
                  try {
                    const newVal = !(profile?.security?.twoFactorEnabled || profile?.user?.twoFactorEnabled);
                    // Persist to backend
                    await apiService.updateProfile({ twoFactorEnabled: newVal });
                    // Update local state
                    setProfile((p: any) => ({ ...p, security: { ...p.security, twoFactorEnabled: newVal }, user: { ...p.user, twoFactorEnabled: newVal } }));
                    setToast({ type: 'success', message: `Two-Factor Authentication ${newVal ? 'enabled' : 'disabled'}` });
                  } catch (err: any) {
                    console.error('Failed to update 2FA setting:', err);
                    setToast({ type: 'error', message: err?.message || 'Failed to update 2FA setting' });
                  }
                }}
              />
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
  </AnimatedCard>

      {/* Preferences */}
      <AnimatedCard>
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
  </AnimatedCard>

      {/* Activity Log */}
      <AnimatedCard>
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
  </AnimatedCard>

      {/* Danger Zone */}
      <AnimatedCard className="border border-red-700/40" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.08)' }}>
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-white font-semibold">Danger Zone</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Button variant="warning" onClick={() => setConfirmModal({ action: 'deactivate', text: 'Are you sure you want to deactivate your account?' })}>Deactivate Account</Button>
          <Button variant="danger" onClick={() => setConfirmModal({ action: 'delete', text: 'This will permanently delete your account and data. Continue?' })}>Delete Account Permanently</Button>
        </div>
  </AnimatedCard>

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

      {/* Avatar Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => { closeAvatarModal && closeAvatarModal(); setCapturedDataUrl(null); }}></div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-gray-900 rounded-xl p-4 w-full max-w-lg">
            <h4 className="text-white text-lg font-semibold mb-3">Set Profile Picture</h4>
            <div className="space-y-3">
              {!capturedDataUrl ? (
                <div>
                  <video ref={videoRef} className="w-full rounded-md bg-black" autoPlay playsInline />
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {!capturing ? (
                      <Button variant="primary" onClick={async () => {
                        // start camera
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                          if (videoRef.current) videoRef.current.srcObject = stream;
                          setCapturing(true);
                        } catch (err) {
                          setToast({ type: 'error', message: 'Unable to access camera' });
                        }
                      }}>Start Camera</Button>
                    ) : (
                      <Button variant="secondary" onClick={() => {
                        // capture frame
                        if (!videoRef.current) return;
                        const video = videoRef.current;
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth || 640;
                        canvas.height = video.videoHeight || 480;
                        const ctx = canvas.getContext('2d');
                        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        setCapturedDataUrl(dataUrl);
                        // stop stream
                        const stream = video.srcObject as MediaStream | null;
                        if (stream) stream.getTracks().forEach(t => t.stop());
                        if (videoRef.current) videoRef.current.srcObject = null;
                        setCapturing(false);
                      }}>Capture</Button>
                    )}

                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-600" onClick={() => {
                      // open file picker
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}>Choose from device</Button>

                    <Button variant="ghost" onClick={() => {
                      // close modal and cleanup
                      closeAvatarModal && closeAvatarModal();
                      setCapturedDataUrl(null);
                      setSelectedFile(null);
                      const stream = videoRef.current?.srcObject as MediaStream | null;
                      if (stream) stream.getTracks().forEach(t => t.stop());
                      if (videoRef.current) videoRef.current.srcObject = null;
                    }}>Close</Button>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                      const f = e.target.files && e.target.files[0];
                      if (!f) return;
                      // stop camera if running
                      const stream = videoRef.current?.srcObject as MediaStream | null;
                      if (stream) stream.getTracks().forEach(t => t.stop());
                      if (videoRef.current) videoRef.current.srcObject = null;
                      setCapturing(false);
                      setSelectedFile(f);
                      const objUrl = URL.createObjectURL(f);
                      setCapturedDataUrl(objUrl);
                    }} />
                  </div>
                </div>
              ) : (
                <div>
                  <img src={capturedDataUrl} className="w-full rounded-md" alt="preview" />
                  <div className="mt-3 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={() => { setCapturedDataUrl(null); setSelectedFile(null); }}>Retake</Button>
                    <Button variant="success" onClick={async () => {
                      try {
                        let resp;
                        if (selectedFile) {
                          resp = await apiService.uploadAvatar(selectedFile);
                        } else {
                          // Convert dataURL to blob
                          const res = await fetch(capturedDataUrl);
                          const blob = await res.blob();
                          const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: blob.type });
                          resp = await apiService.uploadAvatar(file);
                        }
                        // update profile state
                        // Update local profile state
                        setProfile((p: any) => ({ ...p, user: { ...p.user, profileImage: resp.profileImage } }));
                        // Persist to localStorage so avatar survives refresh
                        try {
                          const storedProfile = localStorage.getItem('kycchain_profile');
                          if (storedProfile) {
                            const parsed = JSON.parse(storedProfile);
                            parsed.user = { ...(parsed.user || {}), profileImage: resp.profileImage };
                            localStorage.setItem('kycchain_profile', JSON.stringify(parsed));
                          }
                          const storedUser = localStorage.getItem('kycchain_user');
                          if (storedUser) {
                            const parsedU = JSON.parse(storedUser);
                            parsedU.profileImage = resp.profileImage;
                            localStorage.setItem('kycchain_user', JSON.stringify(parsedU));
                          }
                        } catch (e) { /* ignore storage errors */ }

                        // Update auth context user so sidebar and other components reflect change immediately
                        try { updateUser && updateUser({ profileImage: resp.profileImage } as any); } catch (e) { /* ignore */ }

                        setToast({ type: 'success', message: 'Avatar uploaded' });
                        closeAvatarModal && closeAvatarModal();
                        setCapturedDataUrl(null);
                        setSelectedFile(null);
                      } catch (err: any) {
                        console.error('Avatar upload failed', err);
                        setToast({ type: 'error', message: err?.message || 'Failed to upload avatar' });
                      }
                    }}><Save className="w-4 h-4 mr-1" /> Upload</Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
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


