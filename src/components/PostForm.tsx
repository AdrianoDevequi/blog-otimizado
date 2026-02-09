'use client';

import { createPost, updatePost, deletePost } from "@/app/actions";
import { useFormState } from "react-dom";

const initialState = {
    error: "",
};

export default function PostForm({ post }: { post?: any }) {
    const isEditing = !!post;
    const action = isEditing ? updatePost : createPost;
    const [state, formAction] = useFormState(action, initialState);

    return (
        <form action={formAction} className="max-w-4xl mx-auto space-y-6">
            {state?.error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
                    {state.error}
                </div>
            )}

            {isEditing && <input type="hidden" name="id" value={post.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Título</label>
                    <input
                        name="title"
                        defaultValue={post?.title}
                        required
                        className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[var(--color-primary)] outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Slug (URL)</label>
                    <input
                        name="slug"
                        defaultValue={post?.slug}
                        placeholder="Auto-generated if empty"
                        className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[var(--color-primary)] outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Categoria</label>
                    <input
                        name="category"
                        defaultValue={post?.categoryName || post?.category?.name}
                        required
                        className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[var(--color-primary)] outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Imagem (URL or Upload Path)</label>
                    <input
                        name="imageUrl"
                        defaultValue={post?.imageUrl}
                        placeholder="uploads/example.jpg"
                        className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[var(--color-primary)] outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Resumo</label>
                <textarea
                    name="excerpt"
                    defaultValue={post?.excerpt}
                    rows={3}
                    className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[var(--color-primary)] outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Conteúdo (HTML)</label>
                <textarea
                    name="content"
                    defaultValue={post?.content}
                    rows={15}
                    className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[var(--color-primary)] outline-none font-mono text-sm"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    className="flex-1 bg-[var(--color-primary)] text-black font-bold py-3 rounded hover:brightness-110 transition-all"
                >
                    {isEditing ? "Salvar Alterações" : "Criar Post"}
                </button>

                {isEditing && (
                    <button
                        type="button"
                        onClick={async () => {
                            if (confirm('Tem certeza que deseja excluir este post?')) {
                                await deletePost(post.id);
                            }
                        }}
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-all"
                    >
                        Excluir
                    </button>
                )}
            </div>
        </form>
    );
}
