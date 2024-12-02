import { useState, useEffect } from 'react';
import { getGenreName, searchByTitle, searchByYear, searchByGenre } from '../components/Search/searchApi.js';

function useMovieSearch(){
    const [filterMethod, setFilterMethod] = useState('title');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [genres, setGenres] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch genres on first render
    useEffect(() => {
        const fetchGenres = async () => {
        const data = await getGenreName();
        if (data) {
            setGenres(data.genres);
        }
        };
        fetchGenres();
    }, []);

    async function searchMovies(e) {
        e.preventDefault();
        let data = [];
        try {
            switch (filterMethod) {
                case 'title':
                    data = await searchByTitle(searchText, page);
                    break;
                case 'release_year':
                    data = await searchByYear(searchText, page);
                    break;
                case 'genre':
                    data = await searchByGenre(searchText, genres, page);
                    break;
                default:
                    data = { results: [], total_pages: 0 };
                    break;
            }

            if (data.results) {
                setTotalPages(data.total_pages);
                setResults(data.results);
            } else {
                setTotalPages(0);
                setResults([]);
            }

            if (data.error) {
                setError(true)
            } else {
                setError(false)
            }
        } catch (err) {
            setResults([]);
            setTotalPages(0);
            setError(true);
        } finally {
            setHasSearched(true);
        }
    }

    function newSearch(e) {
        e.preventDefault();
        //setHasSearched(true);
        setPage(1);
        searchMovies(e);
    }

    useEffect(() => {
        if (hasSearched && searchText) {
            searchMovies({ preventDefault: () => {} });
        }
    }, [hasSearched, page, searchText]);

    function nextPage() {
        setPage((currentPage) => Math.min(currentPage + 1, totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function prevPage() {
        setPage((currentPage) => Math.max(currentPage - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return {
        filterMethod,
        setFilterMethod,
        searchText,
        setSearchText,
        results,
        error,
        totalPages,
        page,
        genres,
        hasSearched,
        newSearch,
        nextPage,
        prevPage,
      };
}

export default useMovieSearch;