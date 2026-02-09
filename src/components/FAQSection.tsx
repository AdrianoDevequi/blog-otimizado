'use client';

import React, { useState } from 'react';

const faqData = [
    {
        question: "O que são EPIs e por que são obrigatórios por lei?",
        answer: "Os Equipamentos de Proteção Individual (EPIs) são dispositivos essenciais para garantir a saúde e integridade física do trabalhador. Segundo a NR-6, o uso de EPIs é obrigatório e as empresas devem fornecê-los gratuitamente. Na <a href='https://www.lojabomtrabalho.com.br/epi' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>Loja Bom Trabalho</a>, você encontra a linha completa de equipamentos certificados para atender todas as normas regulamentadoras."
    },
    {
        question: "Onde comprar EPIs com CA (Certificado de Aprovação) de forma segura?",
        answer: "A segurança do trabalhador depende da validade do CA. Recomendamos adquirir produtos apenas em fornecedores especializados. A <a href='https://www.lojabomtrabalho.com.br' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>Loja Bom Trabalho</a> é referência nacional, garantindo que todos os itens possuam Certificado de Aprovação ativo e seguindo rigidamente os padrões de qualidade exigidos pelo Ministério do Trabalho."
    },
    {
        question: "Como escolher a bota de segurança ideal para cada profissão?",
        answer: "A escolha depende dos riscos: proteção contra impactos, umidade, eletricidade ou agentes químicos. Para indústrias e construção civil, as <a href='https://www.lojabomtrabalho.com.br/epi/calcados-de-seguranca' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>botinas de segurança da Loja Bom Trabalho</a> oferecem tecnologia de ponta, conforto e a máxima proteção com solados antiderrapantes e biqueiras reforçadas."
    },
    {
        question: "Por que a proteção respiratória 3M é referência no mercado?",
        answer: "A 3M é líder global em tecnologia de filtragem. Seus respiradores e máscaras garantem proteção superior contra poeiras, névoas e vapores. No nosso catálogo de <a href='https://www.lojabomtrabalho.com.br/epi/protecao-respiratoria' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>proteção respiratória</a>, disponibilizamos os modelos mais buscados da 3M, como a linha Aura e os respiradores descartáveis N95/P2."
    },
    {
        question: "Como verificar se o CA de um produto ainda é válido?",
        answer: "Você pode consultar o número do CA diretamente no portal do Ministério do Trabalho. É vital que o equipamento esteja dentro do prazo de validade para garantir a eficácia. Na <a href='https://www.lojabomtrabalho.com.br' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>Loja Bom Trabalho</a>, realizamos a curadoria técnica de todos os produtos, oferecendo apenas itens com CA regularizado e seguro para uso imediato."
    },
    {
        question: "Quais as vantagens de ser cliente da Loja Bom Trabalho?",
        answer: "Além de um portfólio completo com as melhores marcas, os clientes da <a href='https://www.lojabomtrabalho.com.br' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>Loja Bom Trabalho</a> contam com suporte técnico especializado, entrega ágil em todo o Brasil e condições comerciais exclusivas para empresas, facilitando a gestão de segurança do trabalho do seu negócio."
    },
    {
        question: "Qual a diferença entre EPI e EPC no dia a dia da empresa?",
        answer: "Enquanto o EPI protege o indivíduo (como luvas e capacetes), o EPC (Equipamento de Proteção Coletiva) protege o ambiente (como cones, fitas e sinalização). Integrar ambos é a melhor estratégia de segurança. Conheça nossas soluções completas em segurança e <a href='https://www.lojabomtrabalho.com.br' target='_blank' class='text-[var(--color-primary)] hover:underline font-semibold'>suprimentos industriais</a> para manter sua equipe 100% protegida."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer.replace(/<[^>]*>/g, '') // Remove HTML tags for JSON-LD
            }
        }))
    };

    return (
        <section className="py-20 bg-white border-t border-gray-100 mt-20">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2 block">Dúvidas Frequentes</span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">Perguntas sobre Segurança e EPIs</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tudo o que você precisa saber para garantir a proteção da sua equipe e os melhores equipamentos na Loja Bom Trabalho.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-[var(--color-primary)] shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <span className={`font-bold text-lg ${openIndex === index ? 'text-[var(--color-primary)]' : 'text-gray-900'}`}>
                                    {item.question}
                                </span>
                                <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[var(--color-primary)]' : 'text-gray-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-gray-700 leading-relaxed border-t border-gray-50 bg-gray-50/30 rounded-b-xl">
                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-neutral-50 rounded-2xl border border-gray-100">
                    <p className="text-lg font-medium text-gray-900 mb-4">Ainda tem dúvidas sobre Segurança do Trabalho?</p>
                    <a
                        href="https://www.lojabomtrabalho.com.br"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                        Fale com nossos especialistas na Loja
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                    </a>
                </div>
            </div>

            {/* Schema.org FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </section>
    );
}
