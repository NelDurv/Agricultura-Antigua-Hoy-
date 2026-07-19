import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { PageBlock } from './types';
import SearchBar from '../SearchBar';

/** Hero Block */
function HeroBlock({ block }: { block: Extract<PageBlock, { type: 'hero' }> }) {
  const { badge, title, subtitle, backgroundImage, gradient, searchBar, searchPlaceholder } = block.props;
  return (
    <section className="relative overflow-hidden rounded-2xl mb-6">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div
        className={`relative px-6 sm:px-10 py-12 sm:py-16 ${gradient || 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-800'}`}
      >
        <div className="max-w-3xl">
          {badge && (
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-gold mb-3 border border-gold/30 px-3 py-1 rounded-full">
              {badge}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
          {searchBar && (
            <div className="mt-5 max-w-lg">
              <SearchBar variant="hero" placeholder={searchPlaceholder} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Stats Block */
function StatsBlock({ block }: { block: Extract<PageBlock, { type: 'stats' }> }) {
  const { items, columns = 4 } = block.props;
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[columns];
  return (
    <section className="mb-6">
      <div className={`grid ${gridCols} gap-3`}>
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono">{item.value}</div>
            <div className="text-[10px] font-medium text-stone-500 uppercase tracking-wide mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Card Grid Block */
function CardGridBlock({ block }: { block: Extract<PageBlock, { type: 'card-grid' }> }) {
  const { title, description, items, columns = 3, cardStyle = 'default' } = block.props;
  const gridCols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' }[columns] || 'sm:grid-cols-3';
  const isMinimal = cardStyle === 'minimal';
  return (
    <section className="mb-8">
      {(title || description) && (
        <div className="flex items-end justify-between mb-4">
          <div>
            {title && <h2 className="font-serif text-xl font-bold text-stone-900">{title}</h2>}
            {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
          </div>
          {items.length > 6 && (
            <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0">
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`group bg-white rounded-xl border ${isMinimal ? 'border-stone-100 hover:border-stone-300 p-3' : 'border-stone-200 hover:border-emerald-300 hover:shadow-md p-4'} transition-all cursor-pointer`}
          >
            {item.image && (
              <div className="h-32 rounded-lg mb-3 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
            )}
            <div className="flex items-start gap-2 mb-2">
              {item.icon && <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>}
              <div className="min-w-0">
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold uppercase text-gold bg-gold/10 px-1.5 py-0.5 rounded">{item.badge}</span>
                )}
                <h3 className={`font-semibold text-stone-900 ${isMinimal ? 'text-xs' : 'text-sm'} leading-tight`}>{item.title}</h3>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">{item.description}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((t) => (
                  <span key={t} className="text-[9px] font-mono text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">{t}</span>
                ))}
              </div>
            )}
            {item.meta && (
              <div className="flex gap-3 mt-2 text-[10px] text-stone-400">
                {item.meta.map((m) => (
                  <span key={m.label}><span className="font-medium text-stone-600">{m.label}:</span> {m.value}</span>
                ))}
              </div>
            )}
            {item.footer}
            {item.link && (
              <div className="mt-2 text-[10px] font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
                Ver más <ArrowRight className="h-2.5 w-2.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Feature Grid Block */
function FeatureGridBlock({ block }: { block: Extract<PageBlock, { type: 'feature-grid' }> }) {
  const { title, description, items, columns = 3 } = block.props;
  const gridCols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5' }[columns] || 'sm:grid-cols-3';
  return (
    <section className="mb-8">
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="font-serif text-xl font-bold text-stone-900">{title}</h2>}
          {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-lg shrink-0">
                {item.icon}
              </div>
              <div>
                {item.tag && <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase">{item.tag}</span>}
                <h3 className="text-sm font-semibold text-stone-900 leading-tight">{item.title}</h3>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed ml-11">{item.description}</p>
            {item.link && (
              <div className="ml-11 mt-2 text-[10px] font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
                Explorar <ArrowRight className="h-2.5 w-2.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Accordion Block */
function AccordionBlock({ block }: { block: Extract<PageBlock, { type: 'accordion' }> }) {
  const { title, items } = block.props;
  const [openId, setOpenId] = React.useState<string | null>(items.find((i) => i.defaultOpen)?.id || null);
  return (
    <section className="mb-8">
      {title && <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">{title}</h2>}
      <div className="space-y-2">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50"
              >
                {item.icon && <span className="text-lg shrink-0">{item.icon}</span>}
                <span className="flex-1 text-sm font-semibold text-stone-900">{item.title}</span>
                <svg
                  className={`h-4 w-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-[12px] text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Tabs Block */
function TabsBlock({ block }: { block: Extract<PageBlock, { type: 'tabs' }> }) {
  const { items, defaultTab } = block.props;
  const [activeTab, setActiveTab] = React.useState(defaultTab || items[0]?.id);
  return (
    <section className="mb-8">
      <div className="flex gap-1 border-b border-stone-200 mb-4 overflow-x-auto">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {items.map((tab) => (
        <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
          {tab.content}
        </div>
      ))}
    </section>
  );
}

/** CTA Banner Block */
function CTABannerBlock({ block }: { block: Extract<PageBlock, { type: 'cta-banner' }> }) {
  const { title, description, buttonText, buttonLink, gradient, icon, badge } = block.props;
  return (
    <section className="mb-6">
      <div
        className={`rounded-xl p-6 sm:p-8 ${gradient || 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-800'} text-white relative overflow-hidden`}
      >
        {icon && <div className="text-3xl mb-2">{icon}</div>}
        {badge && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gold border border-gold/30 px-2 py-0.5 rounded-full inline-block mb-2">
            {badge}
          </span>
        )}
        <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
        {description && <p className="text-sm text-stone-300 max-w-lg mb-4">{description}</p>}
        <a
          href={buttonLink}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-gold hover:bg-gold/90 px-4 py-2 rounded-lg transition-colors"
        >
          {buttonText} <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

/** Text Block */
function TextBlock({ block }: { block: Extract<PageBlock, { type: 'text' }> }) {
  const { title, content, variant = 'prose' } = block.props;
  return (
    <section className={`mb-6 ${variant === 'compact' ? '' : ''}`}>
      {title && <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">{title}</h2>}
      <div className={`text-stone-600 leading-relaxed ${variant === 'prose' ? 'text-sm space-y-3' : 'text-[12px]'}`}>
        {content.split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

/** Two Column Block */
function TwoColumnBlock({ block }: { block: Extract<PageBlock, { type: 'two-column' }> }) {
  const { left, right } = block.props;
  const leftWidth = `lg:col-span-${left.width || 4}`;
  const rightWidth = `lg:col-span-${right.width || 8}`;
  return (
    <section className="mb-8">
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6`}>
        <div className={leftWidth}>
          {left.title && <h2 className="font-serif text-lg font-bold text-stone-900 mb-3">{left.title}</h2>}
          {left.content}
        </div>
        <div className={rightWidth}>
          {right.title && <h2 className="font-serif text-lg font-bold text-stone-900 mb-3">{right.title}</h2>}
          {right.content}
        </div>
      </div>
    </section>
  );
}

/** Search Filter Block */
function SearchFilterBlock({ block }: { block: Extract<PageBlock, { type: 'search-filter' }> }) {
  const { placeholder, filters } = block.props;
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  return (
    <section className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || 'Buscar...'}
            className="w-full h-9 pl-3 pr-8 text-[12px] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs">
              ✕
            </button>
          )}
        </div>
        {filters && filters.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                  activeFilter === f.id
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── PageRenderer ── */
const blockRenderers: Record<string, React.FC<{ block: PageBlock }>> = {
  hero: HeroBlock as any,
  stats: StatsBlock as any,
  'card-grid': CardGridBlock as any,
  'feature-grid': FeatureGridBlock as any,
  accordion: AccordionBlock as any,
  tabs: TabsBlock as any,
  'cta-banner': CTABannerBlock as any,
  text: TextBlock as any,
  'two-column': TwoColumnBlock as any,
  'search-filter': SearchFilterBlock as any,
};

export default function PageRenderer({ blocks, className }: { blocks: PageBlock[]; className?: string }) {
  return (
    <div className={className}>
      {blocks.map((block) => {
        const Renderer = blockRenderers[block.type] as React.FC<{ block: any }> | undefined;
        if (!Renderer) {
          console.warn(`[PageRenderer] Unknown block type: ${block.type}`);
          return null;
        }
        return <Renderer key={block.id} block={block} />;
      })}
    </div>
  );
}
