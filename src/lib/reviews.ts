import { reviews, type Review } from "@/data/reviews";

export type { Review };

export function getAllReviews(): Review[] {
    return reviews;
}
