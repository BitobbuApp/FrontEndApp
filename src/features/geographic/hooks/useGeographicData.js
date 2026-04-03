import { useQuery } from '@tanstack/react-query';
import { geographicApi } from '../services/geographicApi';

export default function useGeographicData(selectedCountryId, selectedStateId) {
    const { data: countriesResp, isLoading: isLoadingCountries } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const resp = await geographicApi.getCountries();
            return Array.isArray(resp) ? resp : (resp.data || []);
        },
        staleTime: Infinity, // Geographic data rarely changes, aggressively cache it based on instructions
    });

    const { data: statesResp, isLoading: isLoadingStates } = useQuery({
        queryKey: ['states', selectedCountryId],
        queryFn: async () => {
            const resp = await geographicApi.getStatesByCountry(selectedCountryId);
            return Array.isArray(resp) ? resp : (resp.data || []);
        },
        enabled: !!selectedCountryId,
        staleTime: Infinity,
    });

    /*
    const { data: citiesResp, isLoading: isLoadingCities } = useQuery({
        queryKey: ['cities', selectedStateId],
        queryFn: async () => {
            const resp = await geographicApi.getCitiesByState(selectedStateId);
            return Array.isArray(resp) ? resp : (resp.data || []);
        },
        enabled: !!selectedStateId,
    });
    */

    return {
        countries: Array.isArray(countriesResp) ? countriesResp : (countriesResp?.data || []),
        states: Array.isArray(statesResp) ? statesResp : (statesResp?.data || []),
        // cities: Array.isArray(citiesResp) ? citiesResp : (citiesResp?.data || []),
        isLoadingCountries,
        isLoadingStates,
        // isLoadingCities,
    };
}
