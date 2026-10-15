"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useI18n } from "@/components/providers/i18n-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { DUMMY_TRAINERS } from "@/data/trainers-data"
import { useRouter } from "next/navigation"
import { ChatDialog } from "@/components/marketplace/chat-dialog"
import { trainerApi } from "@/lib/trainer-api"

// Import Sub-components
import { TrainerProfileHeader } from "./trainer-profile-header"
import { TrainerContentMenu } from "./trainer-content-menu"
import { TrainerBookingCard } from "./trainer-booking-card"
import { TrainerMediaPopup } from "./trainer-media-popup"

interface MarketplaceDetailPageProps {
    id: string
}

// Komponen utama untuk halaman Profil Guru (Detail Guru), melihat info lengkap profil, metode mengajar, dan paket harga.
export function MarketplaceDetailPage({ id }: MarketplaceDetailPageProps) {
    const { locale, t } = useI18n()

    const router = useRouter()
    const { userId } = useAuth()
    const [liked, setLiked] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    // Inisialisasi langsung dari sessionStorage (lazy init) agar pilihan paket tidak hilang saat navigasi
    const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
        if (typeof window === "undefined") return "initial"
        return sessionStorage.getItem(`selected_package_${id}`) || "initial"
    })
    // Sync ke sessionStorage setiap kali pilihan paket berubah
    const handleSetSelectedPackageId = (pkgId: string) => {
        setSelectedPackageId(pkgId)
        if (typeof window !== "undefined") {
            sessionStorage.setItem(`selected_package_${id}`, pkgId)
        }
    }
    const [previewItem, setPreviewItem] = useState<{ type: 'image' | 'video', url: string, title?: string } | null>(null)
    const [activeTab, setActiveTab] = useState("info")

    const handleReviewClick = () => {
        setActiveTab("reviews")
        setTimeout(() => {
            document.getElementById("content-menu")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }

    // Close preview on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewItem(null)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const [trainerData, setTrainerData] = useState<typeof DUMMY_TRAINERS[0] | null | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)

    // Sync trainer data with API or Local (Mock Persistence)
    useEffect(() => {
        async function fetchTrainer() {
            setIsLoading(true)
            let baseTrainer;

            if (id.startsWith("api-")) {
                const realId = id.replace("api-", "")
                const apiData = await trainerApi.getTrainerById(realId)
                if (apiData) {
                    baseTrainer = trainerApi.mapApiTrainerToTrainer(apiData)
                } else {
                    baseTrainer = null
                }
            } else {
                baseTrainer = DUMMY_TRAINERS.find((t) => t.id === id) || null
            }

            if (!baseTrainer) {
                setTrainerData(null)
                setIsLoading(false)
                return;
            }

            let mergedTrainer = { ...baseTrainer };

            // Load edited profile from localStorage if it exists (Demo purposes for ID 1)
            if (id === "1") {
                const savedTrainer = localStorage.getItem('trainer_profile')
                if (savedTrainer) {
                    try {
                        const parsed = JSON.parse(savedTrainer)
                        mergedTrainer = { ...mergedTrainer, ...parsed }
                    } catch (e) {
                        console.error("Failed to parse saved trainer", e)
                    }
                }
            }

            // Ensure "Indonesia" is always in the trainer's languages list
            let languages = mergedTrainer.languages || [];
            if (!languages.includes("Indonesia")) {
                languages = ["Indonesia", ...languages];
            }

            if (userId && id === "1") {
                const savedLangs = localStorage.getItem(`user_languages_${userId}`)
                if (savedLangs) {
                    const profileLangs = JSON.parse(savedLangs)
                    languages = profileLangs.includes("Indonesia") ? profileLangs : ["Indonesia", ...profileLangs]
                }
            }

            setTrainerData({ ...mergedTrainer, languages } as any);
            setIsLoading(false)
        }

        fetchTrainer()
    }, [userId, id])

    const trainer = trainerData

    useEffect(() => {
        if (trainer) {
            const title = `Guru - ${trainer.name} | Qurani`;
            document.title = title;
            const headElement = document.querySelector('head');
            if (!headElement) return;

            const observer = new MutationObserver(() => {
                if (document.title !== title) document.title = title;
            });

            observer.observe(headElement, { childList: true, subtree: true, characterData: true });

            return () => {
                observer.disconnect();
            };
        }
    }, [trainer])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">Memuat data guru...</h2>
            </div>
        )
    }

    if (!trainer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">{t("marketplace_detail.guru_not_found", "Guru tidak ditemukan")}</h2>
                <Button onClick={() => router.back()} className="rounded-xl">{t("marketplace_detail.back_button", "Kembali")}</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">

            <TrainerProfileHeader
                trainer={trainer}
                liked={liked}
                setLiked={setLiked}
                setIsChatOpen={setIsChatOpen}
                router={router}
                onReviewClick={handleReviewClick}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* Left Column: Either profile content OR inline course detail */}
                    <div id="content-menu" className="lg:col-span-8">
                        <TrainerContentMenu
                            trainer={trainer}
                            setPreviewItem={setPreviewItem}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            userId={userId ?? undefined}
                        />
                    </div>

                    {/* Right Side: Booking card — always visible */}
                    <div className="lg:col-span-4 space-y-4">
                        <TrainerBookingCard
                            trainer={trainer}
                            selectedPackageId={selectedPackageId}
                            setSelectedPackageId={handleSetSelectedPackageId}
                            locale={locale}
                            router={router}
                        />
                    </div>
                </div>
            </div>

            {/* Preview Modal (Popup Foto/Video) */}
            <TrainerMediaPopup
                previewItem={previewItem}
                setPreviewItem={setPreviewItem}
            />

            {/* Chat Dialog */}
            <ChatDialog
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                trainer={{ id: trainer.id, name: trainer.name, avatar: trainer.avatar }}
                locale={locale}
            />
        </div>
    )
}
