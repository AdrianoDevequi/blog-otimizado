"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SeoContent() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="bg-white border-t border-gray-100 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    Onde comprar EPIs de qualidade por um preço acessível
                </h2>
                <div className={`relative max-w-4xl mx-auto text-gray-600 text-sm leading-relaxed transition-all duration-500 ease-in-out ${isExpanded ? "" : "max-h-[4.8em] overflow-hidden"}`}>
                    <p>
                        A Loja Bom Trabalho é sua parceira confiável em <Link href="/epi" className="text-[var(--color-primary)] hover:underline">equipamentos de proteção individual (EPI)</Link> e segurança no trabalho.
                        Há anos oferecemos <Link href="/luvas-de-protecao" className="text-[var(--color-primary)] hover:underline">luvas de proteção</Link> de qualidade,
                        <Link href="/calcado-de-seguranca" className="text-[var(--color-primary)] hover:underline"> calçados de segurança</Link> certificados e
                        <Link href="/oculos-de-protecao" className="text-[var(--color-primary)] hover:underline"> óculos de proteção</Link> das melhores marcas do mercado.
                        Nossa missão é garantir que profissionais de todas as áreas trabalhem com segurança e confiança,
                        oferecendo <Link href="/ferramentas" className="text-[var(--color-primary)] hover:underline">ferramentas</Link>,
                        <Link href="/sinalizacao-de-seguranca" className="text-[var(--color-primary)] hover:underline"> sinalização de segurança</Link> e
                        <Link href="/equipamentos-para-trabalho-em-altura" className="text-[var(--color-primary)] hover:underline"> equipamentos para trabalho em altura</Link> com certificações reconhecidas.
                        Contamos com <Link href="/marcas" className="text-[var(--color-primary)] hover:underline">marcas renomadas</Link> como Marluvas, 3M, Bracol, Ansell e Honeywell,
                        garantindo qualidade e durabilidade em cada produto.
                        Oferecemos <Link href="/super-atacado" className="text-[var(--color-primary)] hover:underline">opções de super atacado</Link>,
                        <Link href="/pagamento" className="text-[var(--color-primary)] hover:underline"> pagamento em até 10x sem juros</Link> e
                        <Link href="/frete-gratis" className="text-[var(--color-primary)] hover:underline"> frete grátis</Link> para compras acima de R$ 599,90.
                        Visite nossa loja e descubra como proteger sua saúde com as melhores soluções de segurança ocupacional!
                    </p>

                    {/* Gradient Overlay when collapsed */}
                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-1 text-[var(--color-primary)] font-semibold text-sm hover:underline focus:outline-none"
                    >
                        {isExpanded ? (
                            <>
                                Ler menos <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Leia mais <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
