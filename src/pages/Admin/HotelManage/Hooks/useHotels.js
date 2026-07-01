import { useEffect, useState } from 'react';
import { hotelService } from '../../../../services/hotelService';
import { toast } from 'react-toastify';

export const useHotels = () => {
    const [hotelsData, setHotelsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
    });

    const fetchHotels = async (page = 1) => {
        try {
            setLoading(true);
            const response = await hotelService.getAllHotels(page);

            const resData = response.data;

            if (resData?.data && resData?.pagination) {
                setHotelsData(resData.data);
                setPaginationData(resData.pagination);
            } else {
                setHotelsData([]);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách khách sạn');
            setHotelsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= paginationData.last_page) {
            setCurrentPage(page);
        }
    };

    return {
        hotelsData,
        loading,
        currentPage,
        paginationData,
        fetchHotels,
        handlePageChange
    };
};