import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowRight, X } from 'lucide-react';
import { ArticleItem } from '../../types.ts';

interface ArticlesSectionProps {
  articles: ArticleItem[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // RULE: Hide if empty (NO FAKE ARTICLES)
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section id="artikel" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#0089a8] text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Edukasi & Informasi</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Artikel & Panduan
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Informasi terkini dan panduan bermanfaat seputar teknologi pembayaran digital UMKM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                {art.imageUrl && (
                  <div className="aspect-16/9 overflow-hidden bg-slate-100">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {art.publishedAt
                        ? new Date(art.publishedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Terbaru'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00AED6] transition-colors mb-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {art.metaDescription || art.content.slice(0, 140) + '...'}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00AED6] hover:text-[#008ba8] transition cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Artikel
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {selectedArticle.imageUrl && (
                <div className="aspect-16/9 rounded-2xl overflow-hidden mb-6 bg-slate-100">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 pb-6 border-b border-slate-100">
                <span>
                  {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                {selectedArticle.author && <span>Penulis: {selectedArticle.author}</span>}
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
