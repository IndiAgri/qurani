"use client"

import { useState } from "react"
import { useI18n } from "@/components/providers/i18n-provider"
import { useRouter } from "next/navigation"

import { TrainerProfileHeader } from "@/components/marketplace/detail/trainer-profile-header"
import { TrainerContentMenu } from "@/components/marketplace/detail/trainer-content-menu"
import { TrainerBookingCard } from "@/components/marketplace/detail/trainer-booking-card"
import { TrainerMediaPopup } from "@/components/marketplace/detail/trainer-media-popup"

interface ProfileTeacherPageProps {
    trainer: any
}

export function ProfileTeacherPage({ trainer }: ProfileTeacherPageProps) {
    const { locale } = useI18n()
    const router = useRouter()
    
    const [liked, setLiked] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedPackageId, setSelectedPackageId] = useState<string>("initial")
    const [previewItem, setPreviewItem] = useState<{ type: 'image' | 'video', url: string, title?: string } | null>(null)

    return (
        <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
            <TrainerProfileHeader
                trainer={trainer}
                liked={liked}
                setLiked={setLiked}
                setIsChatOpen={setIsChatOpen}
                router={router}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8">
                        <TrainerContentMenu
                            trainer={trainer}
                            setPreviewItem={setPreviewItem}
                        />
                    </div>

                    {/* Right Side */}
                    <div className="lg:col-span-4 space-y-4">
                        <TrainerBookingCard
                            trainer={trainer}
                            selectedPackageId={selectedPackageId}
                            setSelectedPackageId={setSelectedPackageId}
                            locale={locale}
                            router={router}
                            hideBookingButton={true}
                        />
                    </div>
                </div>
            </div>

            <TrainerMediaPopup
                previewItem={previewItem}
                setPreviewItem={setPreviewItem}
            />
        </div>
    )
}
