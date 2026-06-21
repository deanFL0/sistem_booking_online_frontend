import { PublicLayout } from "~/components/layout/public-layout";
import type { Route } from "./+types/my-bookings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { BookingCard } from "~/features/bookings/components/booking-card";
import { bookingApi } from "~/features/bookings/api/booking-api";
import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "~/hooks/use-debounce";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/components/ui/input-group";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Pemesanan Saya" },
        { name: "description", content: "Kelola pemesanan Anda" },
    ];
}

const sortOptions = {
    '-created_at': 'Terbaru',
    'created_at': 'Terlama',
    '-start_datetime': 'Waktu Mulai Terbaru',
    'start_datetime': 'Waktu Mulai Terlama',
} as const;

const statusOptions = {
    '': 'Semua Status',
    'confirmed': 'Dikonfirmasi',
    'cancelled': 'Dibatalkan',
    'completed': 'Selesai',
    'pending': 'Menunggu',
} as const;

export default function MyBookings() {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageIndex = Number(searchParams.get("page") ?? 1) - 1;
    const pageSize = 12;
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
    const sort = searchParams.get("sort") ?? "";

    const [searchInput, setSearchInput] = useState(search);

    const debouncedSearch = useDebouncedValue(searchInput, 500);

    const navigate = useNavigate();

    useEffect(() => {
        updateParam("search", debouncedSearch);
    }, [debouncedSearch]);

    const updateParam = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams);

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        params.set("page", "1");

        setSearchParams(params);
    };

    const handleNext = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageIndex + 2));
        navigate(`?${params.toString()}`);
    };

    const handlePrev = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageIndex));
        navigate(`?${params.toString()}`);
    };

    // Build sorting array
    const sorting = useMemo(() => {
        if (!sort) return [];

        const desc = sort.startsWith("-");
        const id = desc ? sort.slice(1) : sort;

        return [{ id, desc }];
    }, [sort]);

    // Build filters object for Spatie
    const filters = useMemo(() => {
        const filterObj: Record<string, unknown> = {};

        // Search filter - maps to 'booking_code' filter in Spatie
        if (debouncedSearch) {
            filterObj.booking_code = debouncedSearch;
        }

        // Status filter
        if (status) {
            filterObj.status = status;
        }

        return filterObj;
    }, [debouncedSearch, status]);

    const query = useQuery({
        queryKey: [
            "my-bookings",
            pageIndex,
            pageSize,
            sorting,
            filters,
        ],

        queryFn: () =>
            bookingApi.getMyBookings({
                pagination: {
                    pageIndex,
                    pageSize,
                },
                sorting,
                filters,
                includes: ["service"],
            }),

        placeholderData: keepPreviousData,
    });

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    {/* Header Section */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                                    Pemesanan Saya
                                </h1>
                                <p className="text-muted-foreground mt-1 text-lg">
                                    Kelola dan lacak semua pemesanan Anda
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    {query.data?.meta?.total || 0}
                                </span>
                                <span>pemesanan</span>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-card rounded-xl border shadow-sm p-4 md:p-6 mb-8">
                        {/* Search Bar - Full Width */}
                        <div className="mb-6">
                            <InputGroup className="w-full">
                                <InputGroupInput
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Cari kode booking..."
                                    className="h-12 text-base"
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton className="h-12 px-6">
                                        <Search className="h-5 w-5" />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        {/* Filters and Sorting - Flex layout for desktop */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-start gap-4">
                            {/* Status Filter */}
                            <div className="flex-1 min-w-[140px] space-y-1.5">
                                <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                    Status
                                </label>
                                <Select
                                    value={status}
                                    onValueChange={(value) => updateParam("status", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Semua Status">
                                            {statusOptions[status as keyof typeof statusOptions] || "Semua Status"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua Status</SelectItem>
                                        <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                        <SelectItem value="completed">Selesai</SelectItem>
                                        <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort */}
                            <div className="flex-1 min-w-[140px] max-w-[200px] space-y-1.5">
                                <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                    Urutkan
                                </label>
                                <Select
                                    value={sort}
                                    onValueChange={(value) => updateParam("sort", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Urutkan">
                                            {sort && sortOptions[sort as keyof typeof sortOptions]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="-created_at">Terbaru</SelectItem>
                                        <SelectItem value="created_at">Terlama</SelectItem>
                                        <SelectItem value="-start_datetime">Waktu Mulai Terbaru</SelectItem>
                                        <SelectItem value="start_datetime">Waktu Mulai Terlama</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters Button */}
                            <div className="flex-shrink-0">
                                {(search || status || sort) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchInput("");
                                            const params = new URLSearchParams();
                                            params.set("page", "1");
                                            setSearchParams(params);
                                        }}
                                        className="h-10 px-4 text-muted-foreground hover:text-foreground w-full sm:w-auto"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Hapus Filter
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-3">
                        {query.isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                                <p className="mt-4 text-muted-foreground">Memuat pemesanan...</p>
                            </div>
                        ) : (
                            <>
                                {/* Results Count */}
                                {query.data?.data?.length > 0 && (
                                    <div className="mb-4 text-sm text-muted-foreground">
                                        Menampilkan {query.data?.data?.length} dari {query.data?.meta?.total} pemesanan
                                    </div>
                                )}

                                {/* Booking Grid */}
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {query.data?.data?.map((booking: any) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>

                                {/* Empty State */}
                                {!query.data?.data?.length && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="rounded-full bg-muted p-4 mb-4">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Tidak ada pemesanan ditemukan</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Anda belum memiliki pemesanan atau coba sesuaikan filter pencarian Anda
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => {
                                                setSearchInput("");
                                                const params = new URLSearchParams();
                                                params.set("page", "1");
                                                setSearchParams(params);
                                            }}
                                        >
                                            Reset Filter
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pagination */}
                        {query.data?.data?.length > 0 && (
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                                    Halaman {pageIndex + 1} dari {query.data?.meta?.last_page || 1}
                                </div>
                                <div className="flex items-center gap-2 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pageIndex === 0}
                                        onClick={handlePrev}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Button>
                                    <div className="flex items-center gap-1.5 px-2">
                                        {Array.from(
                                            { length: Math.min(5, query.data?.meta?.last_page || 1) },
                                            (_, i) => {
                                                const totalPages = query.data?.meta?.last_page || 1;
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (pageIndex < 3) {
                                                    pageNum = i + 1;
                                                } else if (pageIndex > totalPages - 3) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = pageIndex - 1 + i;
                                                }
                                                return pageNum;
                                            }
                                        ).map((pageNum) => (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === pageIndex + 1 ? "default" : "outline"}
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => {
                                                    const params = new URLSearchParams(searchParams.toString());
                                                    params.set("page", String(pageNum));
                                                    navigate(`?${params.toString()}`);
                                                }}
                                            >
                                                {pageNum}
                                            </Button>
                                        ))}
                                        {query.data?.meta?.last_page > 5 && pageIndex < query.data?.meta?.last_page - 3 && (
                                            <>
                                                <span className="text-muted-foreground">...</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => {
                                                        const params = new URLSearchParams(searchParams.toString());
                                                        params.set("page", String(query.data?.meta?.last_page));
                                                        navigate(`?${params.toString()}`);
                                                    }}
                                                >
                                                    {query.data?.meta?.last_page}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pageIndex + 1 === query.data?.meta?.last_page}
                                        onClick={handleNext}
                                        className="gap-1"
                                    >
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}