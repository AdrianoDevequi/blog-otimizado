import Link from 'next/link';

interface Props {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: Props) {
    if (totalPages <= 1) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    // Simple range for now, can be improved to 1 ... 4 5 6 ... 10
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {prevPage ? (
                <Link
                    href={`${baseUrl}?page=${prevPage}`}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                    &larr; Anterior
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-100 text-gray-300 rounded cursor-not-allowed">
                    &larr; Anterior
                </span>
            )}

            <div className="flex gap-1">
                {pages.map((p) => {
                    // Check if logic to hide extensive pages needed
                    // Show first, last, current, and surrounding
                    if (
                        p === 1 ||
                        p === totalPages ||
                        (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                        return (
                            <Link
                                key={p}
                                href={`${baseUrl}?page=${p}`}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${p === currentPage
                                        ? 'bg-[var(--color-primary)] text-white font-bold'
                                        : 'hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {p}
                            </Link>
                        );
                    } else if (
                        (p === currentPage - 2 && currentPage > 3) ||
                        (p === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                        return <span key={p} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                    }
                    return null;
                })}
            </div>

            {nextPage ? (
                <Link
                    href={`${baseUrl}?page=${nextPage}`}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                    Próxima &rarr;
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-100 text-gray-300 rounded cursor-not-allowed">
                    Próxima &rarr;
                </span>
            )}
        </div>
    );
}
