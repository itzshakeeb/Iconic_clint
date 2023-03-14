import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PrimaryLoading from '../../Components/LoadingSpin/PrimaryLoading';
import AddShopModal from '../../Components/Modal/AddShopModal';
import SecondaryButton from '../../Components/share/Buttons/SecondaryButton';
import BodyTemplate from '../../Components/share/Template/BodyTemplate';
import { useFirebaseInfo } from '../../Context/UserContext';
import AlartMessage from '../../Hooks/AlartMessage';


const RequestForSeller = () => {
    const { user } = useFirebaseInfo();
    const { successMessage } = AlartMessage();
    const [shopModal, setShopeModal] = useState(false);
    const [loadingM, setLoadingM] = useState(false);
    const { data: shops = [], refetch } = useQuery({
        queryKey: ['shops'],
        queryFn: async () => {
            const res = await fetch(`http://localhost:2100/shops?email=${user?.email}`)
            const data = await res.json()
            return data.data
        }
    })
    const requestValidation = (id) => {
        const update = { status: "Unauthorised" }
        fetch(`http://localhost:2100/shop/${id}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(update)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    successMessage('Request Sand')
                }
                refetch()
            })
    }
    useEffect(() => {
        setLoadingM(true)
        setTimeout(() => {
            setLoadingM(false)
        }, 150)
    }, [])

    if (loadingM) return <div className="flex justify-center items-center w-full h-[60vh]">
        <PrimaryLoading />
    </div>
    console.log(shops);
    return (
        <BodyTemplate>
            <div className="w-full mx-auto mb-5">
                <div className=" flex gap-4 p-4 bg-white rounded shadow items-center justify-between">
                    <p className='mb-4 font-bold text-xl'>Add Shop</p>
                    <div className="">
                        <SecondaryButton>
                            <label
                                onClick={() => setShopeModal(true)}
                                className='cursor-pointer' htmlFor="AddShop">Add Shop</label>
                        </SecondaryButton>
                    </div>
                </div>
            </div>
            <div className="mx-auto my-4 w-full">
                <p className='mb-4 font-bold text-xl'>Your Shops</p>
                {/* <div className="grid  md:grid-cols-2 md:gap-3">
                    {shops?.map(shop =>
                        <div className="my-4" key={shop?._id}>
                            <div className="flex gap-6 p-4 bg-white rounded shadow items-center" >
                                <div className="h-36">
                                    <div className="">
                                        <img src={shop?.photoUrl} height="120px" width="120px" alt="" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className='text-xl'>{shop?.name} </p>
                                    <p className='text-gray-600 h-20 overflow-scroll'>{shop?.location}</p>
                                    <div className="py-3 flex">
                                        <p>status: {shop?.status}</p>
                                        {shop?.status === 'Unauthorised' &&
                                            <SecondaryButton>
                                                <p >request Admin For verify</p>
                                            </SecondaryButton>}
                                    </div>
                                </div>
                            </div>

                        </div>

                    )}
                </div> */}

                <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-full max-w-full px-3">
                        <div className="relative flex flex-col min-w-0 mb-6 break-words  border-0 border-transparent border-solid shadow-xl   rounded-2xl bg-clip-border">
                            {/* <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                                <h6 className="">Your Shops</h6>
                            </div> */}
                            <div className="flex-auto px-0 pt-0 pb-2">
                                <div className="p-0 overflow-x-auto">
                                    <table className="items-center w-full mb-0 align-top border-collapse text-slate-500">
                                        <thead className="align-bottom">
                                            <tr>
                                                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none   text-xxs border-b-solid tracking-none whitespace-nowra opacity-70">Shop Details</th>
                                                <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none   text-xxs border-b-solid tracking-none whitespace-nowra opacity-70">Location</th>
                                                <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none   text-xxs border-b-solid tracking-none whitespace-nowrap  opacity-70">Status</th>
                                                <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none   tracking-none whitespace-nowra opacity-70"></th>
                                            </tr>
                                        </thead>
                                        {shops?.map(shop => <tbody key={shop?._id}>
                                            <tr>
                                                <td className="p-2 align-middle bg-transparent border-b  whitespace-nowrap shadow-transparent">
                                                    <div className="flex px-2 py-1">
                                                        <div>
                                                            <img className='h-10 px-3' src={shop?.photoUrl} alt='/' />
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <h6 className="mb-0 text-sm leading-normal ">{shop?.name}</h6>
                                                            <p className="mb-0 text-xs leading-tight">{shop?.ownerEmail}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2 align-middle bg-transparent border-b  whitespace-nowrap shadow-transparent overflow-hidden">

                                                    {shop?.status === 'verified' ?
                                                        <Link to={`/shops/${shop?._id}`} className="mb-0 text-xs font-semibold leading-tight ">{shop?.location.length > 50 ? shop?.location.slice(0, 56) + '..' : shop?.location}
                                                        </Link> :
                                                        <p to={`/shops/${shop?._id}`} className="mb-0 text-xs font-semibold leading-tight ">{shop?.location.length > 50 ? shop?.location.slice(0, 56) + '..' : shop?.location}
                                                        </p>
                                                    }
                                                </td>
                                                <td className="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b  whitespace-nowrap shadow-transparent">
                                                    {shop?.status === 'Unauthorised' ?
                                                        <button
                                                            onClick={() => requestValidation(shop?._id)}
                                                            className='btn btn-sm btn-warning'>Request to admin</button> :
                                                        <span className="bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5  rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"> {shop?.status}</span>
                                                    }
                                                </td>
                                                {shop?.status === 'verified' &&
                                                    <td className="p-2 align-middle bg-transparent border-b  whitespace-nowrap shadow-transparent">
                                                        <a href="/" className="text-xs font-semibold leading-tight"> Edit </a>
                                                    </td>}
                                            </tr>
                                        </tbody>)}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {shopModal &&
                <AddShopModal
                    refetch={refetch}
                    setShopeModal={setShopeModal}

                />}
        </BodyTemplate >
    );
};

export default RequestForSeller;