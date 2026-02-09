'use client';

import { login } from "@/app/actions";
import { useFormState } from "react-dom";

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, formAction] = useFormState(login, initialState);

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-neutral-900 rounded-lg border border-white/10">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <form action={formAction} className="space-y-4">
                {state?.error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm mb-4">
                        {state.error}
                    </div>
                )}
                <div>
                    <label className="block text-sm mb-1 text-gray-400">Usuário</label>
                    <input
                        name="username"
                        type="text"
                        required
                        className="w-full bg-black border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-gray-400">Senha</label>
                    <input
                        name="password"
                        type="password"
                        required
                        className="w-full bg-black border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-black font-bold py-2 rounded hover:brightness-110 transition-all"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
