import { useEffect, useState } from 'react';
import { authService } from '../../../../services/authService';

export const useUsers = () => {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await authService.getAllUsers();
            setUsersData(response || []);
        } catch (error) {
            console.error('Fetch users error:', error);
            setUsersData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        usersData,
        loading,
        fetchUsers
    };
};