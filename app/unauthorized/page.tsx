import { TopNav } from '@/components/ui/TopNav';

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen flex-col">
            <TopNav subtitle="Acceso denegado" />
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-error">Sin permisos</h2>
                <p className="text-on-surface-variant">
                    Tu cuenta no tiene acceso a esta aplicación.
                </p>
            </div>
        </div>
    );
}