
import { Link } from "react-router-dom"
import { useTheme } from "./context/theme-provider"
import { Sun, Moon } from "lucide-react"
import { CitySearch } from "./city-search";

const Header = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto flex items-center justify-between px-4">
            <Link to="/">
            <img src={isDark ? "/logo.png" : "/logo2.png"} alt="Weather App" className="h-14"/>
            </Link>
            <div className="flex items-center gap-2">
                <CitySearch />
                <button onClick={() => setTheme(isDark ? "light" : "dark")} className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}>
                    {isDark ? (<Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />) : (<Moon className="h-6 w-6 rotate-0 text-blue-500 transition-all" />)}
                </button>
            </div>
        </div>
    </header>
  )
}

export default Header