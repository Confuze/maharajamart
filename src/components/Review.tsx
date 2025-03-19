import { Star } from "lucide-react";

export interface IReview {
  title: string;
  review: string;
  score: number;
}

function Review({ title, review, score }: IReview) {
  return (
    <div className="font-serif text-center">
      <div className="flex justify-center gap-2">
        {Array.from(Array(5)).map((_, index) => {
          return (
            <Star
              key={index}
              className="h-7 w-7"
              fill={index <= score ? "#F8B84E" : "#d4d4d4"}
              color={index <= score ? "#F8B84E" : "#d4d4d4"}
            />
          );
        })}
      </div>
      <h2 className="text-4xl mt-2 mb-3 font-bold">{title}</h2>
      <p className="text-lg leading-none">{review}</p>
    </div>
  );
}

export default Review;
