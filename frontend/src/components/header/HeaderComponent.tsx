import { Menu } from 'lucide-react';


interface HeaderProps {
  onToggleDrawer: () => void;
}


export function HeaderComponent({onToggleDrawer} : HeaderProps){
    return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#091413]/60 px-4 backdrop-blur-md">
      <div className="flex items-center">
        <button
          onClick={onToggleDrawer}
          type="button"
          className="rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-xl font-bold tracking-wider" 
         style={{color: '#B0E4CC'}}>
          DCI
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* misschien later instellingen - extra */}
      </div>
    </header>
    );
}