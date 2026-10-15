import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

interface ViewReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName?: string;
    teacherName?: string;
    review: {
        studentName?: string;
        rating: number;
        comment: string;
        createdAt: string;
        response?: string;
        respondedAt?: string;
        isRecommended?: boolean;
        recommendationText?: string;
    } | null;
}

export function ViewReviewModal({ isOpen, onClose, courseName, teacherName, review }: ViewReviewModalProps) {
    const { profile } = useAuth();

    if (!review) return null;

    const studentName = profile?.name || review.studentName;
    const initial = studentName ? studentName.charAt(0).toUpperCase() : "U";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-md rounded-3xl border-none shadow-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-0 shrink-0">
                    <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Ulasan Anda</DialogTitle>
                    <DialogDescription className="text-sm font-medium text-gray-500">
                        {courseName} {teacherName && `— ${teacherName}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-6 pt-6 overflow-y-auto flex-1 min-h-0">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                                    <span className="text-sm font-bold text-emerald-700">
                                        {initial}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{studentName}</p>
                                    <p className="text-xs font-medium text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).replace(/\./g, ':')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-8 h-8",
                                        star <= review.rating
                                            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                            : "text-gray-200"
                                    )}
                                />
                            ))}
                        </div>

                        {review.comment && (
                            <div className="text-gray-700 leading-relaxed text-sm bg-white p-4 rounded-2xl border border-gray-100 font-medium shadow-sm min-h-[80px]">
                                {review.comment}
                            </div>
                        )}

                        {review.response && (
                            <div className="relative mt-2 pl-6 ml-6 border-l-2 border-b-2 border-slate-100 dark:border-slate-800 rounded-bl-xl pb-3">
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 shadow-sm relative -bottom-5 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 mb-3 justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                                            Balasan dari {teacherName || "Guru"}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                            {review.respondedAt ? new Date(review.respondedAt).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).replace(/\./g, ':') : "Beberapa waktu lalu"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {review.response}
                                    </p>
                                </div>
                            </div>
                        )}

                        {review.isRecommended && (
                            <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                                        <ThumbsUp className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900 text-sm">Rekomendasi Murid</p>
                                        </div>
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                                            Merekomendasikan guru ini
                                        </p>
                                    </div>
                                </div>
                                {review.recommendationText && (
                                    <div className="text-gray-700 leading-relaxed text-sm bg-white p-4 rounded-2xl border border-gray-100 font-medium shadow-sm min-h-[80px]">
                                        {review.recommendationText}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-end shrink-0 rounded-b-3xl">
                    <Button variant="default" onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
