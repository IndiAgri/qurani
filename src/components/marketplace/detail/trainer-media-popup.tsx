"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Video, Award, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

interface TrainerMediaPopupProps {
    previewItem: any
    setPreviewItem: (val: any) => void
}

export function TrainerMediaPopup({ previewItem, setPreviewItem }: TrainerMediaPopupProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const media: { type: 'image' | 'video', url: string, title?: string }[] = useMemo(() => previewItem?.media || 
        (previewItem?.images 
            ? previewItem.images.map((img: string) => ({ type: 'image', url: img })) 
            : (previewItem?.url ? [{ type: previewItem.type || 'image', url: previewItem.url, title: previewItem.title }] : [])
        ), [previewItem])

    const images: string[] = useMemo(() => media.map(m => {
        if (m.type === 'video') {
            const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
            const match = m.url.match(regExp)
            return match ? `https://img.youtube.com/vi/${match[1]}/default.jpg` : ""
        }
        return m.url
    }), [media])

    const hasCarousel = media.length > 1
    const currentMedia = media[currentIndex]

    // Set correct index when a new item is opened
    useEffect(() => {
        if (previewItem?.url && media.length > 0) {
            const index = media.findIndex(m => m.url === previewItem.url)
            setCurrentIndex(index !== -1 ? index : 0)
        } else {
            setCurrentIndex(0)
        }
    }, [previewItem]) // ONLY re-run when previewItem changes

    const goPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex(i => (i - 1 + media.length) % media.length)
    }, [media.length])

    const goNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex(i => (i + 1) % media.length)
    }, [media.length])

    // Keyboard navigation
    useEffect(() => {
        if (!previewItem) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewItem(null)
            if (e.key === 'ArrowLeft' && hasCarousel) setCurrentIndex(i => (i - 1 + media.length) % media.length)
            if (e.key === 'ArrowRight' && hasCarousel) setCurrentIndex(i => (i + 1) % media.length)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [previewItem, hasCarousel, media.length])

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    if (!previewItem || !mounted) return null

    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        // Comprehensive Regex for YT
        const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[1].length === 11) ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url
    }

    return (
        <DialogPrimitive.Root open={true} onOpenChange={(open) => !open && setPreviewItem(null)}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
                <DialogPrimitive.Content 
                    className="fixed inset-0 z-[99999] flex items-center justify-center animate-in fade-in duration-300 outline-none"
                    aria-describedby={undefined}
                >
                    <DialogPrimitive.Title className="sr-only">
                        Pratinjau Media
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Tampilan pratinjau media secara layar penuh.
                    </DialogPrimitive.Description>
                    
                    <div className="relative w-full h-full flex items-center justify-center p-6 md:p-12">
                        {/* Close Button */}
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10 z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Prev/Next Buttons */}
                        {hasCarousel && (
                            <>
                                <button
                                    onClick={goPrev}
                                    className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10 z-10 backdrop-blur-md"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10 z-10 backdrop-blur-md"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Content */}
                        <div
                            className="relative flex items-center justify-center max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {currentMedia?.type === 'video' ? (
                                <div className="aspect-video w-[90vw] max-w-5xl rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/5 bg-black">
                                    <iframe
                                        key={currentMedia.url}
                                        src={getEmbedUrl(currentMedia.url)}
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <img
                                    key={currentMedia?.url}
                                    src={currentMedia?.url}
                                    alt={currentMedia?.title || previewItem.title || 'Preview'}
                                    className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/5 animate-in fade-in zoom-in-95 duration-300"
                                />
                            )}
                        </div>

                        {/* Bottom Info Bar (Bottom-Left) */}
                        <div className="absolute bottom-6 left-6 animate-in slide-in-from-bottom duration-500">
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3.5 text-white shadow-2xl flex items-center gap-3.5 w-fit max-w-[80vw]">
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                    {previewItem.type === 'video'
                                        ? <Video className="w-4 h-4 text-white/70" />
                                        : <ImageIcon className="w-4 h-4 text-white/70" />
                                    }
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold text-white/95 truncate">
                                            {currentMedia?.title || previewItem.title || 'Galeri Aktivitas'}
                                        </p>
                                        {hasCarousel && (
                                            <span className="text-[10px] font-black text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 shrink-0">
                                                {currentIndex + 1} / {media.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Centered Thumbnails (Aligned vertically with Info Bar) */}
                        {hasCarousel && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 overflow-x-auto max-w-[50vw] no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-500 pointer-events-auto">
                                {images.map((img, i) => (
                                    <div 
                                        key={i} 
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                                        className={`w-11 h-11 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shrink-0 ${currentIndex === i ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-30 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
