import React, { useState } from 'react';
import { LogoEmblem } from './LogoEmblem';
import { 
  FileText, 
  Search, 
  Building2, 
  HelpCircle, 
  ShieldCheck, 
  Home, 
  BookOpen, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  onQuickTrack: (code: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  onQuickTrack,
}) => {
  const [quickCode, setQuickCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      onQuickTrack(quickCode.trim().toUpperCase());
      setActiveTab('lacak');
      setQuickCode('');
    }
  };

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'pengajuan', label: 'Form Pengajuan', icon: FileText, badge: 'Online' },
    { id: 'lacak', label: 'Lacak Status', icon: Search },
    { id: 'divisi', label: 'Divisi & Kuota', icon: Building2 },
    { id: 'faq', label: 'Panduan & FAQ', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Stripe with Official Government Identity */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Portal Resmi e-Layanan PKL — Dinas Kearsipan & Perpustakaan Kota Pematang Siantar</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span>Email: disarpus@pematangsiantar.go.id</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Senin - Jumat (08.00 - 16.00 WIB)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <div 
            onClick={() => { setActiveTab('beranda'); setIsAdminMode(false); }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <LogoEmblem size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                  e-Layanan PKL
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  DISARPUS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider hidden sm:block">
                Dinas Kearsipan & Perpustakaan Pematang Siantar
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isAdminMode;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsAdminMode(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Track & Admin Switch Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Track Input Form */}
            {!isAdminMode && (
              <form onSubmit={handleTrackSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Lacak No. Reg (e.g. PKL-001)..."
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value)}
                  className="w-48 xl:w-56 pl-3.5 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:w-64 transition-all"
                />
                <button 
                  type="submit" 
                  title="Lacak Registrasi"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Admin Toggle Button */}
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                if (!isAdminMode) setActiveTab('admin');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                isAdminMode
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-700'
                  : 'bg-slate-900 text-slate-100 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminMode ? 'Mode Admin Disarpus' : 'Portal Officer'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-900 text-amber-400 rounded-md"
            >
              {isAdminMode ? 'Admin' : 'Officer'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleTrackSubmit} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Kode Registrasi (e.g. PKL-DISARPUS...)"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg"
            >
              Cari
            </button>
          </form>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isAdminMode;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsAdminMode(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-950 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-700" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
