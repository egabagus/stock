import Badge from '@/Components/Badge';
import Dropdown from '@/Components/Dropdown';
import ToastNotification from '@/Components/ToastNotification';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    Boxes,
    FileText,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Shield,
    Tags,
    Truck,
    User,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Helper aman untuk mengecek route Ziggy tanpa error jika route belum terdaftar
    const hasRoute = (name) => {
        try {
            return route().has(name);
        } catch {
            return false;
        }
    };

    const isCurrent = (name) => {
        try {
            return hasRoute(name) && route().current(name);
        } catch {
            return false;
        }
    };

    const getHref = (name) => {
        try {
            return hasRoute(name) ? route(name) : '#';
        } catch {
            return '#';
        }
    };

    const navSections = [
        {
            title: 'Menu Utama',
            items: [
                {
                    name: 'Dashboard',
                    href: getHref('dashboard'),
                    active: isCurrent('dashboard'),
                    icon: LayoutDashboard,
                    available: true,
                },
            ],
        },
        {
            title: 'Master Data',
            items: [
                {
                    name: 'Data Barang',
                    href: getHref('items.index'),
                    active: isCurrent('items.*'),
                    icon: Package,
                    available: hasRoute('items.index'),
                },
                {
                    name: 'Kategori',
                    href: getHref('categories.index'),
                    active: isCurrent('categories.*'),
                    icon: Tags,
                    available: hasRoute('categories.index'),
                },
                {
                    name: 'Supplier',
                    href: getHref('suppliers.index'),
                    active: isCurrent('suppliers.*'),
                    icon: Truck,
                    available: hasRoute('suppliers.index'),
                },
            ],
        },
        {
            title: 'Transaksi Stok',
            items: [
                {
                    name: 'Barang Masuk',
                    href: getHref('stock-in.index'),
                    active: isCurrent('stock-in.*'),
                    icon: ArrowDownLeft,
                    available: hasRoute('stock-in.index'),
                },
                {
                    name: 'Barang Keluar',
                    href: getHref('stock-out.index'),
                    active: isCurrent('stock-out.*'),
                    icon: ArrowUpRight,
                    available: hasRoute('stock-out.index'),
                },
            ],
        },
        {
            title: 'Monitoring & Laporan',
            items: [
                {
                    name: 'Riwayat & Mutasi',
                    href: getHref('stock-mutations.index'),
                    active: isCurrent('stock-mutations.*'),
                    icon: History,
                    available: hasRoute('stock-mutations.index'),
                },
                {
                    name: 'Laporan Persediaan',
                    href: getHref('reports.index'),
                    active: isCurrent('reports.*'),
                    icon: FileText,
                    available: hasRoute('reports.index'),
                },
            ],
        },
    ];

    // Menu khusus admin
    if (user.role === 'admin') {
        navSections.push({
            title: 'Pengaturan Sistem',
            items: [
                {
                    name: 'Manajemen Pengguna',
                    href: getHref('users.index'),
                    active: isCurrent('users.*'),
                    icon: Users,
                    available: hasRoute('users.index'),
                },
            ],
        });
    }

    const renderNavContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300">
            {/* Header Brand */}
            <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/30">
                    <Boxes className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-bold text-white text-base tracking-tight leading-none">
                        Stock UMKM
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-0.5">Sistem Persediaan</p>
                </div>
            </div>

            {/* Navigasi Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {navSections.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            {section.title}
                        </p>
                        <div className="space-y-0.5 pt-1">
                            {section.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                const isActive = item.active;
                                const isReady = item.available;

                                return isReady ? (
                                    <Link
                                        key={itemIdx}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                ) : (
                                    <div
                                        key={itemIdx}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed select-none opacity-60"
                                        title="Fitur ini akan diimplementasikan pada milestone berikutnya"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-slate-400" />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                            Soon
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom User Section */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate leading-tight">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5 capitalize">
                                {user.role === 'admin' ? 'Administrator' : 'Staf Gudang'}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Log Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <ToastNotification />

            {/* Desktop Sidebar (Fixed Left) */}
            <aside className="hidden lg:flex lg:flex-col w-64 fixed inset-y-0 z-30 shadow-xl border-r border-slate-800">
                {renderNavContent()}
            </aside>

            {/* Mobile Drawer Backdrop & Sidebar */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full shadow-2xl">
                        <div className="absolute top-3 right-3 z-10">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {renderNavContent()}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Top Bar Header */}
                <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            {header ? (
                                <div className="text-lg font-bold text-slate-900 tracking-tight">
                                    {header}
                                </div>
                            ) : (
                                <div className="text-base font-semibold text-slate-800">
                                    Dashboard Persediaan
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant={user.role === 'admin' ? 'primary' : 'default'} className="hidden sm:inline-flex">
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role === 'admin' ? 'Admin' : 'Staf Gudang'}
                        </Badge>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
                                >
                                    <div className="w-7 h-7 rounded-md bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline-block">
                                        {user.name}
                                    </span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('profile.edit')}>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-500" />
                                        <span>Profil Akun</span>
                                    </div>
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    <div className="flex items-center gap-2 text-rose-600">
                                        <LogOut className="w-4 h-4" />
                                        <span>Keluar (Logout)</span>
                                    </div>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
