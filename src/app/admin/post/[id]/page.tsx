import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const { id: paramId } = await params;
    let post = null;

    if (paramId !== "new") {
        const id = parseInt(paramId);
        if (!isNaN(id)) {
            post = await prisma.post.findUnique({
                where: { id },
            });
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                {post ? "Editar Post" : "Novo Post"}
            </h1>
            <PostForm post={post} />
        </div>
    );
}
