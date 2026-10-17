import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ToastNotification() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        } else if (flash?.warning) {
            setMessage(flash.warning);
            setType('warning');
            setVisible(true);
        } else if (flash?.info) {
            setMessage(flash.info);
            setType('info');
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible || !message) return null;

    const styles = {
        success: {
            bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
        error: {
            bg: 'bg-rose-50 border-rose-200 text-rose-800',
            icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200 text-amber-800',
            icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        info: {
            bg: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        },
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
            <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${currentStyle.bg}`}>
                {currentStyle.icon}
                <div className="flex-1 text-sm font-medium leading-5 pt-0.5">
                    {message}
                </div>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-md"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
