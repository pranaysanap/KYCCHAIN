import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import { ConsentRecord, getConsents, grantConsent, revokeConsent } from '../../services/mockApi';

const institutions = ['HDFC Bank', 'SBI Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'];

const statusBadge = (status: 'granted' | 'revoked') => (
  <span
    className={
      status === 'granted'
        ? 'px-2 py-1 text-xs rounded-full bg-green-900/40 text-green-300 border border-green-700/40'
        : 'px-2 py-1 text-xs rounded-full bg-red-900/40 text-red-300 border border-red-700/40'
    }
  >
    {status === 'granted' ? 'Granted' : 'Revoked'}
  </span>
);

const ConsentPage: React.FC = () => {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'granted' | 'revoked'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getConsents();
        setConsents(data);
      } catch (e) {
        setToast({ type: 'error', message: 'Failed to load consents' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return consents
      .filter(c => (filter === 'all' ? true : c.status === filter))
      .filter(c => c.institutionName.toLowerCase().includes(search.toLowerCase()));
  }, [consents, search, filter]);

  const handleToggle = async (institutionName: string, current: 'granted' | 'revoked') => {
    try {
      const updated =
        current === 'granted' ? await revokeConsent(institutionName) : await grantConsent(institutionName);
      setConsents(prev =>
        prev.map(c => (c.institutionName === institutionName ? { ...c, ...updated } : c))
      );
      setToast({ type: 'success', message: current === 'granted' ? 'Consent revoked' : 'Consent granted' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Operation failed' });
    }
  };

  const openGrantModal = () => {
    setSelectedInstitution('');
    setIsModalOpen(true);
  };

  const confirmGrant = async () => {
    if (!selectedInstitution) return;
    // Prevent duplicate granted
    if (consents.some(c => c.institutionName.toLowerCase() === selectedInstitution.toLowerCase() && c.status === 'granted')) {
      setToast({ type: 'error', message: 'Consent already granted for this institution' });
      return;
    }
    try {
      const created = await grantConsent(selectedInstitution);
      // Animate insert: place on top
      setConsents(prev => [created, ...prev]);
      setIsModalOpen(false);
      setToast({ type: 'success', message: 'Consent granted' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to grant consent' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Consent Management</h1>
            <p className="text-gray-300">Control which institutions can access your KYC documents</p>
          </div>
          <Button variant="primary" onClick={openGrantModal} className="neon-glow-blue">
            <Plus className="w-4 h-4 mr-2" /> Grant New Consent
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search institutions"
              className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search institutions"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
              className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              <option value="granted">Granted</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glassmorphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Institution Consents</h3>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-300">Loading consents...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Access Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No matching institutions</td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="transition-colors">
                      <td className="px-6 py-4 text-white">{c.institutionName}</td>
                      <td className="px-6 py-4">{statusBadge(c.status)}</td>
                      <td className="px-6 py-4 text-gray-300">{new Date(c.lastUpdated).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Button
                          variant={c.status === 'granted' ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => handleToggle(c.institutionName, c.status)}
                          aria-label={c.status === 'granted' ? 'Revoke consent' : 'Grant consent'}
                        >
                          {c.status === 'granted' ? 'Revoke' : 'Grant'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
          <div role="dialog" aria-modal="true" aria-label="Grant Consent" className="relative glassmorphism rounded-xl p-6 w-full max-w-md">
            <h4 className="text-white text-lg font-semibold mb-4">Grant Consent</h4>
            <div className="space-y-2 mb-6">
              <label htmlFor="institution" className="text-sm text-gray-300">Select institution</label>
              <select
                id="institution"
                value={selectedInstitution}
                onChange={e => setSelectedInstitution(e.target.value)}
                className="w-full bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Choose an institution</option>
                {institutions.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={confirmGrant} disabled={!selectedInstitution}>Confirm</Button>
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

export default ConsentPage;


