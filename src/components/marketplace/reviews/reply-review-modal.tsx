import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/providers/auth-provider";

interface ReplyReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (replyText: string) => void;
    studentName?: string;
    existingReply?: string;
}

export function ReplyReviewModal({ isOpen, onClose, onSubmit, studentName, existingReply }: ReplyReviewModalProps) {
    const { profile } = useAuth();
    const displayName = (studentName === "Andi (Murid)" && profile) ? profile.name : studentName;
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        if (isOpen) {
            setReplyText(existingReply || "");
        }
    }, [isOpen, existingReply]);

    const handleSubmit = () => {
        if (replyText.trim()) {
            onSubmit(replyText);
            setReplyText("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setReplyText("");
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 bg-white">
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        {existingReply ? "Edit Balasan Ulasan" : "Balas Ulasan"}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-gray-500 mt-1">
                        Untuk ulasan dari {displayName || "Murid"}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-3 bg-white">
                    <label className="text-sm font-bold text-gray-700 block">
                        Tanggapan Anda
                    </label>
                    <Textarea
                        placeholder="Tuliskan ucapan terima kasih atau tanggapan Anda..."
                        className="min-h-[120px] rounded-xl resize-none bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-sm font-medium"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                </div>

                <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={!replyText.trim()}
                    >
                        {existingReply ? "Simpan" : "Kirim"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
