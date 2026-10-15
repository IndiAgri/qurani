import React from "react";
import { ReviewData } from "@/lib/booking";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/providers/auth-provider";

interface ReviewCardProps {
    review: ReviewData;
    readOnly?: boolean;
    courseName?: string;
    onReply?: (review: ReviewData) => void;
}

export function ReviewCard({ review, readOnly = true, courseName, onReply }: ReviewCardProps) {
    const { profile } = useAuth();
    const displayName = (review.studentName === "Andi (Murid)" && profile) ? profile.name : review.studentName;

    let formattedDate = "";
    let relativeDate = "";
    try {
        const dateObj = new Date(review.createdAt);
        formattedDate = format(dateObj, "dd MMM yyyy, HH:mm", { locale: idLocale });
        relativeDate = formatDistanceToNow(dateObj, { addSuffix: true, locale: idLocale })
            .replace("sekitar ", "")
            .replace("lebih dari ", "");
    } catch {
        formattedDate = review.createdAt;
        relativeDate = review.createdAt;
    }

    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3 items-start">
                    <Avatar className="w-10 h-10 border border-gray-100 shadow-sm">
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <h4 className="font-bold text-gray-900 text-sm">{displayName}</h4>
                            {courseName && (
                                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 w-fit border-slate-200">
                                    {courseName}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "w-3.5 h-3.5",
                                            star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button 
                                            onClick={(e) => e.stopPropagation()} 
                                            className="text-[11px] text-gray-400 font-medium cursor-help focus:outline-none hover:text-gray-600 transition-colors"
                                        >
                                            · {relativeDate}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p className="text-xs">{formattedDate}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-700 font-medium leading-relaxed sm:pl-13">
                {review.comment}
            </p>

            {review.response && (
                <div className="ml-0 sm:ml-13 mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 relative before:absolute before:left-6 before:-top-2 before:w-4 before:h-4 before:bg-slate-50 before:border-l before:border-t before:border-slate-100 before:rotate-45">
                    <div className="flex items-center relative z-10 gap-2">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                                <span className="text-[10px]">👨‍🏫</span>
                            </div>
                            Respon Anda
                        </span>
                        {review.respondedAt && (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-[10px] text-gray-400 font-medium cursor-help focus:outline-none hover:text-gray-600 transition-colors mt-0.5"
                                        >
                                            • {(() => {
                                                try {
                                                    return formatDistanceToNow(new Date(review.respondedAt), { addSuffix: true, locale: idLocale })
                                                        .replace("sekitar ", "")
                                                        .replace("lebih dari ", "")
                                                } catch {
                                                    return review.respondedAt
                                                }
                                            })()}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p className="text-xs">
                                            {(() => {
                                                try {
                                                    return format(new Date(review.respondedAt), "dd MMM yyyy, HH:mm", { locale: idLocale })
                                                } catch {
                                                    return review.respondedAt
                                                }
                                            })()}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed relative z-10 pl-1">
                        {review.response}
                    </p>
                </div>
            )}
            {!readOnly && (
                <div className="flex justify-end pt-2">
                    <Button
                        variant={review.response ? "outline" : "default"}
                        size="sm"
                        onClick={() => onReply?.(review)}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {review.response ? "Edit Balasan" : "Balas"}
                    </Button>
                </div>
            )}
        </div>
    );
}
