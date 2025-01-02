/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Navbar from '@/components/custom/Navbar';

const Page = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        } else {
            setError('No user name found in local storage');
        }
    }, []);

    useEffect(() => {
        if (name) {
            fetchBookings(name);
        }
    }, [name]);

    const fetchBookings = async (userName: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_domain!}/api/bookings/${userName}`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error: any) {
            toast.error(error);
            setError('Error fetching bookings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Navbar />
            <main className=" absolute top-[12vh] left-0 flex flex-col items-center justify-start w-full h-fit overflow-x-hidden overflow-y-auto">
                <h1 className="text-3xl font-semibold mb-4">Welcome, <span className=' bg-orange-200 px-2 py-1'>{name ? (name.at(0)?.toUpperCase() + name.slice(1, name.length)) : ""}</span></h1>

                {/* Loading State */}
                {loading && <p>Loading your bookings...</p>}

                {/* Error Handling */}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* Show bookings if available */}
                {bookings.length > 0 && (
                    <div className="mt-8 w-4/5 md:w-1/2">
                        <h2 className="text-2xl font-semibold">Your Bookings</h2>
                        <div className="space-y-4">
                            {bookings.map((booking: any) => (
                                <div
                                    key={booking._id}
                                    className="border border-gray-300 p-4 rounded-lg shadow-sm"
                                >
                                    <h3 className="font-bold">{booking.name}</h3>
                                    <p><strong>Email:</strong> {booking.email}</p>
                                    <p><strong>Phone:</strong> {booking.phone}</p>
                                    <p><strong>Visit Date:</strong> {format(new Date(booking.date), 'PPP')}</p>
                                    <p><strong>Time:</strong> {booking.time}</p>
                                    <p><strong>Guests:</strong> {booking.guests}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* If no bookings, display a message */}
                {bookings.length === 0 && !loading && !error && (
                    <p>No bookings found for {name}.</p>
                )}
            </main>
        </React.Fragment>
    );
};

export default Page;
