/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileJson, 
  ExternalLink, 
  ChevronRight, 
  Film, 
  LayoutGrid, 
  List, 
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Code,
  FileText,
  Terminal,
  Database
} from 'lucide-react';

interface Movie {
  name: string;
  url: string;
  poster: string;
  episode: string;
  sheet: string;
}

export default function App() {
  const [sheetId, setSheetId] = useState('1VayeOn2LK8aUOJvAFguh48LLf0y7xv11y0FeQMcKuNE');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [jsonView, setJsonView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('Extraction Plan');

  const fetchSheetData = async () => {
    if (!sheetId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movies?id=${sheetId}`);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      
      const formattedMovies: Movie[] = data.map((movie: any) => ({
        ...movie,
        sheet: 'G-Sheet Data'
      }));

      setMovies(formattedMovies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(movies, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-bg text-text-main font-sans selection:bg-accent/20">
      {/* Sidebar Navigation */}
      <nav className="w-[240px] bg-sidebar text-white p-6 flex flex-col hidden lg:flex border-r border-border shrink-0">
        <div className="text-accent font-[800] text-sm tracking-[0.1em] uppercase mb-10 flex items-center gap-2">
          <Film size={18} />
          <span>MovieFlow SDK</span>
        </div>
        
        <div className="space-y-1">
          {[
            { name: 'Extraction Plan', icon: FileText },
            { name: 'Schema Definitions', icon: Database },
            { name: 'API Documentation', icon: Code },
            { name: 'CloudStream SDK', icon: Terminal },
            { name: 'Log Viewer', icon: Terminal },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-all ${
                activeTab === item.name 
                ? 'bg-white/10 opacity-100 font-semibold' 
                : 'opacity-70 hover:opacity-100 hover:bg-white/5'
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
          <div className="bg-white/5 rounded-lg p-3">
            <h5 className="text-[11px] font-bold text-accent uppercase tracking-wider mb-2">Build Info</h5>
            <div className="space-y-1 text-[10px] font-mono opacity-50">
              <p>v1.0.4-stable</p>
              <p>Last Sync: 2m ago</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-auto flex flex-col">
        {/* Header */}
        <header className="px-8 pt-8 pb-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b-2 border-border mb-4 sticky top-0 bg-bg z-20">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Conversion Strategy</h1>
            <p className="text-[12px] text-text-muted">Google Sheets to Production JSON Pipeline</p>
          </div>
          <div className="font-mono text-[11px] bg-[#E5E7EB] text-text-main px-2 py-1 rounded border border-border flex items-center gap-2">
            <span className="opacity-50">ID:</span>
            <span>{sheetId.substring(0, 15)}...{sheetId.substring(sheetId.length - 8)}</span>
          </div>
        </header>

        <div className="px-8 pb-12 flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative flex items-center bg-white border border-border rounded-lg shadow-sm focus-within:border-accent group">
              <span className="pl-4 pr-2 text-text-muted group-focus-within:text-accent transition-colors">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                value={sheetId} 
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Google Sheet ID..."
                className="flex-1 py-3 pr-4 bg-transparent border-none outline-none text-[13px] text-text-main"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchSheetData}
                disabled={loading || !sheetId}
                className="bg-text-main text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2 text-[13px] font-semibold"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Terminal size={16} />}
                Run Process
              </button>
              <button 
                onClick={() => setJsonView(!jsonView)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                  jsonView 
                  ? 'bg-accent border-accent text-white shadow-lg' 
                  : 'bg-white border-border hover:bg-gray-50 text-text-main shadow-sm'
                } text-[13px] font-medium`}
              >
                <FileJson size={16} />
                JSON
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 text-[13px]"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-white border border-border p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-bg text-text-main' : 'text-text-muted hover:bg-gray-50'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-bg text-text-main' : 'text-text-muted hover:bg-gray-50'}`}
              >
                <List size={18} />
              </button>
            </div>
            <div className="text-[11px] font-mono text-text-muted bg-white border border-border px-2 py-0.5 rounded uppercase tracking-wider">
              {movies.length} Documents Found
            </div>
          </div>

          <AnimatePresence mode="wait">
            {jsonView ? (
              <motion.div 
                key="json"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative rounded-lg border border-border bg-sidebar overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-bold text-white/40">
                  <span>Raw Serialization Output</span>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-8 text-[11px] font-mono text-[#D4D4D4] overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
                  {JSON.stringify(movies, null, 2)}
                </pre>
              </motion.div>
            ) : (
              <motion.div 
                key="visual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {movies.length === 0 && !loading ? (
                  <div className="py-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center bg-white/50">
                    <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center mb-4 text-text-muted shadow-sm">
                      <Terminal size={24} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Null Pointer Detected</h3>
                    <p className="text-[12px] text-text-muted max-w-xs">
                      No data loaded. Execute the ingestion pipeline by providing a valid Spreadsheet ID above.
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {movies.map((movie, idx) => (
                      <motion.div 
                        key={idx}
                        className="bg-white border border-border rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-accent transition-all duration-300 group"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                          <img 
                            src={movie.poster || `https://picsum.photos/seed/${movie.name}/400/533`} 
                            alt={movie.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className="px-2 py-0.5 rounded bg-text-main text-white text-[9px] font-bold uppercase tracking-tighter">
                              EP {movie.episode}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="text-[13px] font-bold text-text-main line-clamp-1 mb-3">
                            {movie.name}
                          </h4>
                          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] text-accent font-bold uppercase tracking-wide px-1.5 py-0.5 bg-accent/10 rounded">
                              {movie.sheet}
                            </span>
                            <a 
                              href={movie.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-text-muted hover:text-accent transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-border rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden">
                    {movies.map((movie, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-all group">
                        <div className="w-8 h-10 rounded border border-border overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={movie.poster || `https://picsum.photos/seed/${movie.name}/120/160`} 
                            alt={movie.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold text-text-main truncate">{movie.name}</h4>
                          <code className="text-[10px] text-text-muted font-mono truncate block">{movie.url}</code>
                        </div>
                        <div className="text-right hidden sm:block w-20">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block mb-0.5">Pilot</span>
                          <span className="font-mono text-[11px] text-accent font-bold bg-accent/5 px-1.5 py-0.5 rounded">{movie.episode}</span>
                        </div>
                        <a 
                          href={movie.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-text-muted hover:text-accent transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'CloudStream SDK' ? (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8 pt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-[14px] uppercase tracking-wider font-bold text-text-main flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Kotlin Provider Boilerplate
                  </h2>
                  <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                    <p className="text-[13px] text-text-muted mb-4">
                      Sử dụng đoạn mã này trong file <code className="text-accent">MovieProvider.kt</code> của bạn để đọc dữ liệu từ JSON.
                    </p>
                    <pre className="bg-sidebar text-[#D4D4D4] p-5 rounded-md text-[11px] font-mono overflow-auto max-h-[400px]">
{`class MovieProvider : MainAPI() {
    override var name = "My GSheet Movies"
    override var mainUrl = "https://your-api-url.com"
    override var supportedTypes = setOf(TvType.Movie)

    override suspend fun getMainPage(page: Int, request: MainPageRequest): HomePageResponse? {
        val json = app.get("\$mainUrl/api/movies").text
        val movies = parseJson<List<MovieData>>(json)
        
        return newHomePageResponse(
            movies.map { movie ->
                newMovieSearchResponse(movie.name, movie.url) {
                    this.posterUrl = movie.poster
                }
            }
        )
    }
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-[14px] uppercase tracking-wider font-bold text-text-main flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    CloudStream Inbound Pipeline
                  </h2>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Bước 1: Host JSON", 
                        desc: "Deploy ứng dụng này hoặc copy JSON lên GitHub Gist để lấy link Raw." 
                      },
                      { 
                        title: "Bước 2: Tạo Repo Extension", 
                        desc: "Sử dụng template 'cloudstream-extensions-template' trên GitHub." 
                      },
                      { 
                        title: "Bước 3: Map Model", 
                        desc: "Đảm bảo data class trong Kotlin có các trường: name, url, poster, episode." 
                      },
                      { 
                        title: "Bước 4: Cài đặt vào App", 
                        desc: "Build file .zip/jar, upload lên repo và add link repo vào CloudStream." 
                      }
                    ].map((step, i) => (
                      <div key={i} className="bg-white border border-border rounded-lg p-4 shadow-sm">
                        <h4 className="text-[13px] font-bold text-text-main mb-1">{step.title}</h4>
                        <p className="text-[12px] text-text-muted">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
              <div className="space-y-6">
                <h2 className="text-[14px] uppercase tracking-wider font-bold text-text-main flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Extraction Workflow
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      num: '01',
                      title: "Sheet Metadata Discovery",
                      steps: ["Utilize Google Sheets API spreadsheets.get endpoint.", "Filter spreadsheet.sheets array for title properties.", "Map titles to an internal array for processing."],
                      code: "const sheets = response.data.sheets.map(s => s.properties.title);"
                    },
                    {
                      num: '02',
                      title: "Row-Level Ingestion",
                      steps: ["Fetch values using range: 'SheetName!A:D'.", "Apply Array.slice(1) to ignore the header row.", "Validate row length matches required schema."],
                      code: "const rows = valueRange.values.slice(1);"
                    }
                  ].map((item) => (
                    <div key={item.num} className="bg-white border border-border rounded-lg p-5 flex flex-col shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-text-main text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {item.num}
                        </div>
                        <h3 className="text-[14px] font-bold uppercase tracking-tight">{item.title}</h3>
                      </div>
                      <ul className="text-[13px] text-text-main space-y-2 mb-4 leading-relaxed">
                        {item.steps.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-accent font-bold">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto">
                        <code className="block bg-sidebar text-[#D4D4D4] p-3 rounded-md text-[11px] font-mono overflow-auto scrollbar-hide whitespace-nowrap">
                          {item.code}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-[14px] uppercase tracking-wider font-bold text-text-main flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Pipeline Specification
                </h2>

                <div className="space-y-4">
                  <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-text-main text-white rounded-full flex items-center justify-center text-[10px] font-bold">03</div>
                      <h3 className="text-[14px] font-bold uppercase tracking-tight">Object Serialization</h3>
                    </div>
                    <table className="w-full text-[12px] border-collapse">
                      <thead>
                        <tr className="text-left text-text-muted border-b border-border">
                          <th className="pb-2 font-semibold">G-Sheet Column</th>
                          <th className="pb-2 font-semibold">JSON Property</th>
                          <th className="pb-2 font-semibold">Format</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { col: 'Name', prop: 'name', fmt: 'String' },
                          { col: 'Link', prop: 'url', fmt: 'URL String' },
                          { col: 'Poster', prop: 'poster', fmt: 'IMG URL' },
                          { col: 'Pilot', prop: 'episode', fmt: 'String/Num' },
                        ].map((row) => (
                          <tr key={row.prop}>
                            <td className="py-2.5 font-medium">{row.col}</td>
                            <td className="py-2.5"><code className="text-accent bg-accent/5 px-1 py-0.5 rounded text-[11px]">{row.prop}</code></td>
                            <td className="py-2.5 text-text-muted">{row.fmt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4">
                      <code className="block bg-sidebar text-[#D4D4D4] p-3 rounded-md text-[11px] font-mono overflow-auto scrollbar-hide whitespace-nowrap">
                        return {`{`} name: row[0], url: row[1], ... {`}`};
                      </code>
                    </div>
                  </div>

                  <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-text-main text-white rounded-full flex items-center justify-center text-[10px] font-bold">04</div>
                        <h3 className="text-[14px] font-bold uppercase tracking-tight">Complex Link Routing</h3>
                      </div>
                      <span className="text-[10px] font-bold bg-[#EBF5FF] text-[#0055CC] px-2 py-0.5 rounded-full uppercase">Roadmap</span>
                    </div>
                    <ul className="text-[13px] text-text-main space-y-2 leading-relaxed mb-4">
                      <li className="flex gap-2"><span className="text-accent font-bold">•</span> Implement URL Resolver service.</li>
                      <li className="flex gap-2"><span className="text-accent font-bold">•</span> Detect patterns for Drive Folders vs streams.</li>
                      <li className="flex gap-2"><span className="text-accent font-bold">•</span> Introduce recursive fetching in Phase 2.</li>
                    </ul>
                    <p className="text-[11px] text-text-muted italic border-t border-gray-100 pt-3 flex items-center gap-2">
                      <AlertCircle size={12} />
                      Regex pattern matching recommended for link categorization.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] font-bold">
              &copy; 2026 MovieFlow Protocol
            </p>
            <div className="flex gap-6 text-[11px] text-text-muted">
              <span className="hover:text-accent cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-accent cursor-pointer transition-colors">Security Audit</span>
              <span className="hover:text-accent cursor-pointer transition-colors">Support</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}


