import { Star } from "lucide-react";

export default function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-marigold-500 text-marigold-500" />
      <span className="font-mono text-xs font-medium text-ink-700">{rating.toFixed(1)}</span>
    </div>
  );
}
