'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import Navbar from "@/components/custom/Navbar";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    phone: z.string().min(10, {
        message: "Enter a valid phone number.",
    }).max(10, {
        message: "Enter a valid phone number.",
    }),
    visitDate: z.date({
        required_error: "A date of visit is required.",
    }),
    slots: z.number({
        required_error: "Please select a slot.",
    }),
    time: z.string().min(1, {
        message: "Time is required.",
    }),
});

const Page = () => {

    const [availableSlots, setAvailableSlots] = useState<number[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            visitDate: undefined,
            slots: undefined,
            time: ""
        },
    });

    // Fetch available slots for a specific date
    const fetchAvailableSlots = async (date?: Date) => {
        try {
            const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
            const endpoint = formattedDate
                ? `${process.env.NEXT_PUBLIC_domain!}/api/slots/${formattedDate}`
                : `${process.env.NEXT_PUBLIC_domain!}/api/slots/today`;

            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                setAvailableSlots([...Array(data.availableSlots).keys()].map((i) => i + 1));
            } else {
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    // Submit form data and book a slot
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const { visitDate, slots, name, email, phone, time } = values;
        try {
            const formattedDate = format(visitDate, "yyyy-MM-dd");

            // Structure the payload as per the backend's expectations
            const bookingPayload = {
                date: formattedDate,
                guests: slots,
                name,
                phone,
                email,
                time,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_domain!}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingPayload),
            });

            if (response.ok) {
                if (!localStorage.getItem("name")) {
                    localStorage.setItem("name", name);
                }
                if (localStorage.getItem("name")) {
                    localStorage.removeItem("name");
                    localStorage.setItem("name", name);
                }
                toast.success("Booking confirmed!");
                form.reset();
                fetchAvailableSlots(visitDate);
            } else {
                const errorData = await response.json();
                toast.error(`Booking failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during booking:", error);
            alert("An error occurred. Please try again.");
        }
    };

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (values.visitDate) {
                fetchAvailableSlots(values.visitDate);
            }
        });

        fetchAvailableSlots();

        return () => subscription.unsubscribe();
    }, [form]);

    return (
        <React.Fragment>
            <Navbar />
            <main className=" absolute top-[7vh] left-0 h-[93vh] w-screen flex flex-row justify-center items-center overflow-hidden">
                <section className="h-[93vh] w-[calc(100vw-500px)] max-md:w-screen flex flex-col justify-center items-center bg-orange-50">
                    <div className=" w-3/5 max-md:w-[90%] h-fit bg-white shadow-orange-200 p-12 max-md:py-6 rounded-2xl shadow-2xl max-md:backdrop-blur">
                        <h1 className="text-3xl font-mono font-semibold text-center">Book a Table</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-md:space-y-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" className="border-slate-400" type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email address" className="border-slate-400" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your phone number" className="border-slate-400" type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="visitDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Visit Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal bg-transparent border-slate-400",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value!}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                        }}
                                                        disabled={(date) => date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slots"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number of Available Slots</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full border border-slate-400 p-2 rounded-md"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}  // Convert value to number
                                                >
                                                    {
                                                        availableSlots.length ? (
                                                            <>
                                                                <option value="">
                                                                    Select a slot
                                                                </option>
                                                                {availableSlots.map((slot) => (
                                                                    <option key={slot} value={slot}>
                                                                        {slot}
                                                                    </option>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <option value="" disabled>
                                                                No Slot Available
                                                            </option>
                                                        )
                                                    }
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter time" className="border-slate-400" type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className=" bg-orange-500 hover:bg-orange-600 w-full shadow" type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </section>
                <section className=" h-screen w-[500px] max-md:hidden">
                    <Image
                        src="/book.jpg"
                        alt="Book Image"
                        width={600}
                        height={800}
                        className=" w-[500px] h-screen max-md:hidden"
                        loading="lazy"
                    />
                </section>
            </main>
        </React.Fragment>
    );
};

export default Page;
