import React, { createContext, useContext, useEffect, useState } from 'react';

const pagination = createContext();

const UsePagination = ({ children }) => {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [products, setProducts] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);



    useEffect(() => {

        if (search?.length > 0 && products === true) {
            const filterResult = data.filter(u => u?.Names?.toLowerCase().includes(search?.toLowerCase()))
            if (filterResult.length === 0) { setSearchLoading(true) }
            setSearchLoading(false)
            setSearchData(filterResult)
        } else if (search?.length > 0 && !products) {
            const filterResult = data.filter(u => u?.name?.toLowerCase().includes(search?.toLowerCase()))
            if (filterResult.length === 0) { setSearchLoading(true) }
            setSearchLoading(false)
            setSearchData(filterResult)
        } else {
            if (data.length === 0) {
                setSearchLoading(true)
            }
            setSearchLoading(false)
            setSearchData(data)
        }
    }, [search, data, setData, products, setProducts])

    const value = { data, setData, search, setSearch, searchData, setSearchData, products, setProducts, searchLoading, setSearchLoading }

    return (
        <pagination.Provider value={value} >
            {children}
        </pagination.Provider>
    );

}

export const usePagination = () => {
    const context = useContext(pagination);
    if (context === undefined) {
        throw new Error('usePagination must be used within a PaginationProvider')
    }
    return context
}

export default UsePagination;