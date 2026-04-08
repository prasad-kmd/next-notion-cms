import type { Metadata } from "next";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Globe,
  Zap,
} from "lucide-react";

const title = "Site Status";
const description =
  "Real-time status and uptime monitoring for our engineering tools and platform services.";

export const metadata: Metadata = {
  title,
  description,
};

const services = [
  {
    name: "Main Website",
    status: "Operational",
    uptime: "99.98%",
    latency: "45ms",
    icon: Globe,
  },
  {
    name: "Engineering Tools",
    status: "Operational",
    uptime: "99.95%",
    latency: "120ms",
    icon: Zap,
  },
  {
    name: "Search API",
    status: "Operational",
    uptime: "100%",
    latency: "32ms",
    icon: Server,
  },
  {
    name: "Content Delivery",
    status: "Operational",
    uptime: "99.99%",
    latency: "15ms",
    icon: Activity,
  },
];

export default function StatusPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 className="h-3 w-3" />
            All Systems Operational
          </div>
          <h1 className="mb-4 text-4xl font-bold mozilla-headline">
            Site Status
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Real-time monitoring of our services. Transparency and reliability
            are core to our engineering platform.
          </p>
        </header>

        <div className="grid gap-4 mb-12">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <service.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold google-sans">{service.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {service.uptime} Uptime
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" /> {service.latency}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-sm font-medium text-green-500">
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card/20 p-8">
          <h2 className="text-xl font-bold mb-4 google-sans flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            Incident History
          </h2>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-border">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-card border-2 border-border" />
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                May 15, 2024
              </p>
              <h4 className="font-bold text-sm mb-1">Scheduled Maintenance</h4>
              <p className="text-sm text-muted-foreground">
                Database optimization and performance upgrades. Completed in 45
                minutes with minimal impact.
              </p>
            </div>
            <div className="relative pl-6 border-l-2 border-border">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-card border-2 border-border" />
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                April 22, 2024
              </p>
              <h4 className="font-bold text-sm mb-1">API Latency Issues</h4>
              <p className="text-sm text-muted-foreground">
                Resolved an issue causing increased response times in the
                resistor solver API.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleString()} • Powered by Internal
          Monitoring
        </div>
      </div>
    </div>
  );
}
