import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./components/ui/theme-provider"

const DarkMode = () => {
  const { setTheme } = useTheme()

  return (
   <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer select-none"
        >
          {/* Sun Icon (Light Mode) */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          
          {/* Moon Icon (Dark Mode) */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      {/* Dropdown Menu Style matched with Premium Navbar */}
      <DropdownMenuContent 
        align="end" 
        className="w-32 mt-2 rounded-xl p-1 shadow-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="rounded-lg cursor-pointer font-medium text-sm py-2 focus:bg-slate-100 dark:focus:bg-slate-900 text-slate-700 dark:text-slate-300"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="rounded-lg cursor-pointer font-medium text-sm py-2 focus:bg-slate-100 dark:focus:bg-slate-900 text-slate-700 dark:text-slate-300"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="rounded-lg cursor-pointer font-medium text-sm py-2 focus:bg-slate-100 dark:focus:bg-slate-900 text-slate-700 dark:text-slate-300"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DarkMode