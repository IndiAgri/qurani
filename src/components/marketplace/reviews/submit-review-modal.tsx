import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SubmitReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string, isRecommended?: boolean, recommendationText?: string) => void;
    courseName?: string;
    teacherName?: string;
}

export function SubmitReviewModal({ isOpen, onClose, onSubmit, courseName, teacherName }: SubmitReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isRecommended, setIsRecommended] = useState(false);
    const [recommendationText, setRecommendationText] = useState("");
    const recommendationInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isRecommended && recommendationInputRef.current) {
            recommendationInputRef.current.focus();
        }
    }, [isRecommended]);

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment, isRecommended, recommendationText);
            setRating(0);
            setComment("");
            setIsRecommended(false);
            setRecommendationText("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setRating(0);
                setComment("");
                setIsRecommended(false);
                setRecommendationText("");
                onClose();
            }
        }}>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-md rounded-3xl border-none shadow-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-0 shrink-0">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Berikan Ulasan</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {teacherName ? `Pertemuan dengan ${teacherName}` : courseName || "Sesi Pembelajaran"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-6 space-y-6 overflow-y-auto flex-1 min-h-0">
                    <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Pilih Rating</span>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={cn(
                                            "w-9 h-9",
                                            star <= (hoverRating || rating)
                                                ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                                : "text-slate-200 dark:text-slate-800"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Kesan, Kritik & Saran
                        </label>
                        <Textarea
                            placeholder="Ceritakan pengalaman Anda di sesi ini..."
                            className="min-h-[120px] rounded-2xl resize-none bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500/20 text-sm font-medium"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label 
                            htmlFor="recommendation"
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors"
                        >
                            <Checkbox
                                id="recommendation"
                                checked={isRecommended}
                                onCheckedChange={(checked) => setIsRecommended(checked as boolean)}
                                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-0.5"
                            />
                            <div className="space-y-1 leading-none">
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Rekomendasikan guru ini?
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                    Berikan rekomendasi yang akan ditampilkan di profil guru sebagai referensi bagi murid lain.
                                </p>
                            </div>
                        </label>

                    </div>
                </div>

                <DialogFooter className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-end gap-2 shrink-0 rounded-b-3xl">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={rating === 0 || comment.trim() === ""}
                    >
                        Kirim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
