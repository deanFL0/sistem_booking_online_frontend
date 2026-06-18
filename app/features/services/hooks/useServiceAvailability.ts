// hooks/useServiceAvailability.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { serviceApi } from '../api/service-api';

interface UseServiceAvailabilityProps {
    serviceId?: string | number;
    initialDate?: string | null;
}

interface UseServiceAvailabilityReturn {
    availableDates: string[];
    availableTimes: string[];
    selectedDate: string | null;
    isLoading: boolean;
    isTimesLoading: boolean;
    error: string | null;
    selectDate: (date: string) => void;
    clearSelection: () => void;
    refetchDates: () => Promise<void>;
    refetchTimes: () => Promise<void>;
}

export const useServiceAvailability = ({
    serviceId,
    initialDate = null,
}: UseServiceAvailabilityProps): UseServiceAvailabilityReturn => {
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
    const [isLoading, setIsLoading] = useState(false);
    const [isTimesLoading, setIsTimesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use refs to prevent infinite loops
    const serviceIdRef = useRef(serviceId);
    const selectedDateRef = useRef(selectedDate);

    // Fetch available dates
    const fetchDates = useCallback(async () => {
        if (!serviceId) {
            setAvailableDates([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await serviceApi.getAvailableDates(String(serviceId));

            // Extract available_dates from response
            // Handle both response.data and direct response
            const dates = response?.available_dates || [];
            setAvailableDates(dates);

            if (dates.length === 0) {
                setError('No available dates found for this service');
            }
        } catch (err: any) {
            console.error('Error fetching dates:', err);
            const errorMessage = err?.response?.data?.message ||
                err?.message ||
                'Failed to fetch available dates';
            setError(errorMessage);
            setAvailableDates([]);
        } finally {
            setIsLoading(false);
        }
    }, [serviceId]);

    // Fetch available times for selected date
    const fetchTimes = useCallback(async () => {
        if (!serviceId || !selectedDate) {
            setAvailableTimes([]);
            return;
        }

        setIsTimesLoading(true);
        setError(null);

        try {
            const response = await serviceApi.getAvailableTimes(String(serviceId), selectedDate);

            // Extract available_time_slots from response
            // Handle both response.data and direct response
            const times = response?.available_time_slots || [];
            setAvailableTimes(times);

            if (times.length === 0) {
                setError('No available times found for this date');
            }
        } catch (err: any) {
            console.error('Error fetching times:', err);
            const errorMessage = err?.response?.data?.message ||
                err?.message ||
                'Failed to fetch available times';
            setError(errorMessage);
            setAvailableTimes([]);
        } finally {
            setIsTimesLoading(false);
        }
    }, [serviceId, selectedDate]);

    // Select a date and fetch its times
    const selectDate = useCallback((date: string) => {
        setSelectedDate(date);
        setAvailableTimes([]);
        setError(null);
    }, []);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedDate(null);
        setAvailableTimes([]);
        setError(null);
    }, []);

    // Refetch dates
    const refetchDates = useCallback(async () => {
        await fetchDates();
    }, [fetchDates]);

    // Refetch times for current selected date
    const refetchTimes = useCallback(async () => {
        await fetchTimes();
    }, [fetchTimes]);

    // Fetch dates when serviceId changes
    useEffect(() => {
        if (serviceId) {
            fetchDates();
        } else {
            setAvailableDates([]);
            setSelectedDate(null);
            setAvailableTimes([]);
            setError(null);
        }
    }, [serviceId, fetchDates]);

    // Fetch times when selected date changes
    useEffect(() => {
        if (selectedDate !== selectedDateRef.current) {
            selectedDateRef.current = selectedDate;
            if (selectedDate && serviceId) {
                fetchTimes();
            }
        }
    }, [selectedDate, serviceId, fetchTimes]);

    return {
        availableDates,
        availableTimes,
        selectedDate,
        isLoading,
        isTimesLoading,
        error,
        selectDate,
        clearSelection,
        refetchDates,
        refetchTimes,
    };
};