import { useEffect, useRef, useState } from 'react';
import { fetchSportFild, fetchFilteredSportFild } from '../../../../services/sportFild';

const useSearch = () => {
  const [searchParams, setSearchParams] = useState({
    type: null,
    searchTitleOrAddres: null,
    date: null,
    startTime: null,
    duration: null,
    city: null,
  });
  
  const [sportFild, setSportFild] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const prevSearchParamsRef = useRef();

  const areParamsEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!prevSearchParamsRef.current) {
        prevSearchParamsRef.current = searchParams;
        return;
      }

      if (areParamsEqual(prevSearchParamsRef.current, searchParams)) {
        return;
      }

      setLoading(true);
      setNoResultsFound(false);
      
      try {
        const hasFilters = Object.values(searchParams).some(param => param !== null);
        const data = hasFilters 
          ? await fetchFilteredSportFild(searchParams) 
          : await fetchSportFild();

        setSportFild(data || []);
        setNoResultsFound(!data || data.length === 0);
        prevSearchParamsRef.current = searchParams;
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
        setNoResultsFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return {
    searchParams,
    setSearchParams,
    sportFild,
    loading,
    noResultsFound
  };
};

export default useSearch;