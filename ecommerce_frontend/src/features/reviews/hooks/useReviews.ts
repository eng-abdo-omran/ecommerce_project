import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getReviews } from "../api/reviews.api";
import type { ReviewsQuery } from "../api/reviews.api";
import { reviewsKeys } from "../api/reviews.keys";

export function useReviews(params: ReviewsQuery) {
  return useQuery({
    queryKey: reviewsKeys.list(params),
    queryFn: () => getReviews(params),
    placeholderData: keepPreviousData,
  });
}
