import { useForecastQuery, useWeatherQuery } from '../hooks/use-weather'
import { useParams, useSearchParams } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import WeatherSkeleton from '../components/loading-skeleton'
import CurrentWeather from '../components/current-weather'
import HourlyTemperature from '../components/hourly-temperature'
import { WeatherDetails } from '../components/weather-details'
import { WeatherForecast } from '../components/weather-forecast'
import { FavoriteButton } from "../components/favorite-button";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params =useParams();
  const lat = parseFloat(searchParams.get("lat") || "0")
  const lon = parseFloat(searchParams.get("lon") || "0")
      const forecastQuery = useForecastQuery({lat, lon});
      const weatherQuery = useWeatherQuery({lat, lon});

      if(weatherQuery.error || forecastQuery.error){
        return <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle> Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
      }
      if(!weatherQuery.data || !forecastQuery.data || !params.cityName){
        return <WeatherSkeleton/>
      }
  return (
    <div className='space-y-4'>
       <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold tracking-tight'>{params.cityName}, {weatherQuery.data.sys.country}</h1>
            <div className="flex gap-2">
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
        </div>
       <div className='grid gap-6'>
            <div className="flex flex-col  gap-4">
                  <CurrentWeather data={weatherQuery.data}  />
                <HourlyTemperature data={forecastQuery.data}/>
            </div>
        </div>
        <div className='grid gap-6 md:grid-cols-2 items-start'>
        <WeatherDetails data={weatherQuery.data} />
        <WeatherForecast data={forecastQuery.data} />
        </div>
    </div>
  )
}

export default CityPage