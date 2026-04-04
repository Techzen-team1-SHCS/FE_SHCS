import { useState, useEffect } from "react";
import { staffListMock } from "../Mock/staffData";

export const useStaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [searchId, setSearchId] = useState("");
    
    useEffect(() => {
        setStaffList(staffListMock);
    }, []);

    const deleteStaff = (id) => {
        setStaffList(prev => prev.filter(staff => staff.id !== id));
    };

    const addStaff = (newStaff) => {
        const id = staffList.length ? Math.max(...staffList.map(s => s.id)) + 1 : 1;
        setStaffList(prev => [...prev, { ...newStaff, id }]);
    };

    const editStaff = (id, updatedStaff) => {
        setStaffList(prev => prev.map(staff => staff.id === id ? { ...updatedStaff, id } : staff));
    };

    const displayList = staffList.filter(staff => 
        staff.id.toString().includes(searchId)
    );

    return {
        staffList: displayList,
        searchId,
        setSearchId,
        deleteStaff,
        addStaff,
        editStaff
    };
};
