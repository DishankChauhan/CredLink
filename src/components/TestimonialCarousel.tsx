"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "lucide-react";

interface Testimonial {
  company: string;
  logo?: string;
  name: string;
  role: string;
  review: string;
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[];
}

export const TestimonialCarousel = React.forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  ({ className, testimonials, ...props }, ref) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
      if (!api) return;
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);

    return (
      <div ref={ref} className={cn("py-16", className)} {...props}>
        <Carousel
          setApi={setApi}
          className="max-w-screen-xl mx-auto px-4 lg:px-8"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={`testimonial-${index}`}
                className="flex flex-col items-center cursor-grab"
              >
                <div className="mb-7 h-8 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600 capitalize">
                    {testimonial.company}
                  </span>
                </div>
                <p className="max-w-xl text-balance text-center text-xl sm:text-2xl text-gray-800">
                  "{testimonial.review}"
                </p>
                <h5 className="mt-5 font-medium text-gray-600">
                  {testimonial.name}
                </h5>
                <h5 className="mt-1.5 font-medium text-gray-500">
                  {testimonial.role}
                </h5>
                <div className="mt-5 relative h-12 w-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
                  {testimonial.logo ? (
                    <img
                      src={testimonial.logo}
                      alt={`${testimonial.company} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-indigo-400" />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  index === current ? "bg-indigo-600" : "bg-indigo-200"
                )}
                onClick={() => {
                  if (api) api.scrollTo(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCarousel.displayName = "TestimonialCarousel"; 