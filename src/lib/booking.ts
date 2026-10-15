export interface ReviewData {
  id: string;
  trainerId?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  [key: string]: any;
}

export function getAllReviews(trainerId?: string): ReviewData[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("myqurani_reviews");
    const reviews: ReviewData[] = saved ? JSON.parse(saved) : [];
    if (trainerId) {
      return reviews.filter((r) => String(r.trainerId || r.teacherId) === String(trainerId));
    }
    return reviews;
  } catch {
    return [];
  }
}

export function submitReview(review: Partial<ReviewData>): ReviewData & { success: boolean; message?: string } {
  const newReview: ReviewData & { success: boolean; message?: string } = {
    id: `rev-${Date.now()}`,
    rating: review.rating || 5,
    comment: review.comment || "",
    createdAt: review.createdAt || new Date().toISOString(),
    success: true,
    message: "Ulasan berhasil dikirim",
    ...review,
  };

  if (typeof window !== "undefined") {
    try {
      const all = getAllReviews();
      localStorage.setItem("myqurani_reviews", JSON.stringify([newReview, ...all]));
      window.dispatchEvent(new Event("myqurani_reviews_updated"));
    } catch {}
  }
  return newReview;
}

export function getReviewByBookingId(bookingId: string | number): ReviewData | null {
  const all = getAllReviews();
  return all.find((r) => String(r.bookingId || r.orderId) === String(bookingId)) || null;
}

export function getReviewsByTeacherId(teacherId: string | number): ReviewData[] {
  return getAllReviews(String(teacherId));
}

export const courseApi = {
  getCategories: async () => [],
};
