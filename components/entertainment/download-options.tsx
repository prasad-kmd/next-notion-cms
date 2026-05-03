import { getYTSMovie, getMagnetLink } from "@/lib/yts";
import { Download, ExternalLink, AlertTriangle } from "lucide-react";

interface DownloadOptionsProps {
  imdbId: string;
  title: string;
}

export async function DownloadOptions({ imdbId, title }: DownloadOptionsProps) {
  const movie = await getYTSMovie(imdbId);

  if (!movie || !movie.torrents || movie.torrents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 bg-card border border-border/10 p-8 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3 font-serif uppercase">
          <Download className="h-6 w-6 text-primary" />
          Download Options
        </h2>
        <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded font-bold uppercase tracking-widest border border-yellow-500/20">
          Experimental
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movie.torrents.map((torrent, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 p-5 rounded-xl border border-border/5 bg-background/40 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xl font-black text-foreground group-hover:text-primary transition-colors font-sans uppercase">
                  {torrent.quality}
                </span>
                <span className="ml-2 text-xs text-muted-foreground uppercase font-medium font-sans">
                  {torrent.type}
                </span>
              </div>
              <span className="text-sm font-bold text-muted-foreground font-mono">
                {torrent.size}
              </span>
            </div>

            <div className="flex gap-2">
              <a
                href={getMagnetLink(torrent.hash, title)}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-center text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-sans uppercase"
              >
                Magnet Link
              </a>
              <a
                href={torrent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border/20 rounded-lg text-muted-foreground hover:text-foreground hover:border-border transition-all"
                title="Download .torrent file"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-500/80 leading-relaxed italic font-mono">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p>
          <strong className="font-sans uppercase not-italic">
            Disclaimer:
          </strong>{" "}
          YTS provides torrents for movies. We do not host any files.
          Downloading copyrighted content may be illegal in your jurisdiction.
          Use at your own risk.
        </p>
      </div>
    </div>
  );
}
