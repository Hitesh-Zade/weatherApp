import { Button } from '../components/ui/button'
import { AlertTriangle, MapPin, RefreshCw } from 'lucide-react'
import { useGeolocation } from '../hooks/use-geoloacation'
import WeatherSkeleton from '@/components/loading-skeleton';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { useReverseGeocodeQuery, useForecastQuery, useWeatherQuery } from '../hooks/use-weather'
import CurrentWeather from '@/components/current-weather'
import HourlyTemperature from '@/components/hourly-temperature'
import { WeatherDetails } from '@/components/weather-details'
import { WeatherForecast } from '@/components/weather-forecast'
import { FavoriteCities } from '@/components/favorite-cities';
const WeatherDashboard = () => {
    const {coordinates, error:locationError, isLoading:locationLoading, getLocation} = useGeolocation();
    //console.log(coordinates, locationError, locationLoading, getLocation);
    const locationQuery = useReverseGeocodeQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);
    const weatherQuery = useWeatherQuery(coordinates);
    console.log(locationQuery);
    console.log(forecastQuery);
    console.log(weatherQuery);
    const handleRefresh = () => {
        getLocation();
        if(coordinates){
            //console.log(coordinates);
            weatherQuery.refetch();
            forecastQuery.refetch();
            locationQuery.refetch();
        }
    }

    if(locationLoading){
        return <WeatherSkeleton/>
    }

    if(locationError){
        return <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>{locationError}</p>
          <Button onClick={getLocation} variant="outline" className='w-fit'> 
                <MapPin className="h-4 w-4 mr-2"/>
                Enable Location
            </Button>
        </AlertDescription>
      </Alert>
    }

  if(!coordinates){
     return (
      <Alert variant="destructive">
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className='flex flex-col gap-4'>
        <p>Please enable location to see your local weather</p>
        <Button onClick={getLocation} variant="outline" className='w-fit'> 
              <MapPin className="h-4 w-4 mr-2"/>
              Enable Location
          </Button>
      </AlertDescription>
    </Alert>
     )
  }

  const locationName = locationQuery.data?.[0];
  if(weatherQuery.error || forecastQuery.error){
    return <Alert variant="destructive">
    <AlertTriangle />
    <AlertTitle> Error</AlertTitle>
    <AlertDescription className='flex flex-col gap-4'>
      <p>{weatherQuery.error?.message}</p>
      <Button onClick={handleRefresh} variant="outline" className='w-fit'> 
            <RefreshCw className="h-4 w-4 mr-2"/>
            Retry
        </Button>
    </AlertDescription>
  </Alert>
  }

  if(!weatherQuery.data || !forecastQuery.data){
    return <WeatherSkeleton/>
  }
  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
            <Button variant="outline" size="icon" 
            onClick={handleRefresh}
             disabled={weatherQuery.isFetching || forecastQuery.isFetching}
            >
                <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
            </Button>
        </div>
        <FavoriteCities />
        <div className='grid gap-6'>
            <div className="flex flex-col lg:flex-row gap-4">
                  <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
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

export default WeatherDashboard