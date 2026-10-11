import { Link } from 'react-router-dom';
import { Container, Image, HardDrive, Network, ArrowRight, Activity, Cpu } from 'lucide-react';
import { useContainers } from '../../hooks/useContainers';

export function HomeScreen() {
  const { containers } = useContainers();

  const totalContainers = containers?.length || 0;
  const runningContainers = containers?.filter((c) => c.state === 'running').length || 0;

  const navigationCards = [
    {
      title: 'Containers',
      description: 'View active and stopped containers, inspect logs, and manage their lifecycle.',
      path: '/containers',
      icon: Container,
      badge: `${runningContainers} / ${totalContainers} Running`,
    },
    {
      title: 'Images',
      description: 'Manage local Docker images, inspect tags, sizes, and clean up unused versions.',
      path: '/images',
      icon: Image,
    },
    {
      title: 'Volumes',
      description: 'Inspect attached storage volumes and check which containers are using them.',
      path: '/volumes',
      icon: HardDrive,
    },
    {
      title: 'Networks',
      description: 'Inspect virtual Docker networks and active port bindings.',
      path: '/networks',
      icon: Network,
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* header */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#285A48] to-[#091413] border border-[#408A71]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#408A71]/30 border border-[#408A71]/50 text-[#B0E4CC] text-xs font-semibold">
            <Activity className="size-3.5 animate-pulse" />
            Docker Daemon Online
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#B0E4CC] tracking-tight">
            Docker Container Interface
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Welcome to your personal Docker dashboard. Easily manage your local containers, dependencies, images, and volumes without needing the CLI.
          </p>
        </div>

        <Link
          to="/containers"
          className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#B0E4CC] hover:bg-emerald-300 text-[#091413] font-bold rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>Go to Containers</span>
          <ArrowRight className="size-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[#408A71]/30 bg-[#285A48]/20 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#408A71]/30 text-[#B0E4CC]">
            <Container className="size-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Containers</p>
            <p className="text-2xl font-bold text-white">{totalContainers}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#408A71]/30 bg-[#285A48]/20 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300">
            <Cpu className="size-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Running</p>
            <p className="text-2xl font-bold text-emerald-400">{runningContainers}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#B0E4CC]">Management Modules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.path}
                className="group p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 hover:bg-[#285A48]/60 hover:border-[#408A71] transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#408A71]/30 text-[#B0E4CC] group-hover:bg-[#B0E4CC] group-hover:text-[#091413] transition-colors">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#B0E4CC] transition-colors">
                        {card.title}
                      </h3>
                    </div>

                    {card.badge && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#091413] text-[#B0E4CC] border border-[#408A71]/40">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-[#B0E4CC] group-hover:translate-x-1 transition-transform gap-1.5 pt-2">
                  <span>Open {card.title}</span>
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}