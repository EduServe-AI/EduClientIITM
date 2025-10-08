'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { studentCarouselItems } from '@/lib/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

export default function Slidercarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 6000,
        }),
      ]}
      className="w-full"
    >
      {/* Here comes the carousel content */}
      <CarouselContent>
        {studentCarouselItems.map((item, index) => (
          <CarouselItem key={index} className="">
            <div className="p-1">
              <Card className="border-black border-2 overflow-hidden">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
                  {/* Left-Side : Text Content */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    {/* Title on the top */}
                    <h2 className="text-3xl md:text-4xl text-black font-semibold font-serif">
                      {item.title}
                    </h2>
                    {/* Subtitle on the bottom */}
                    <p className="text-lg text-black italic">{item.subtitle}</p>
                  </div>

                  {/* Right-Side : Image */}
                  <div className="relative w-full h-48 md:w-1/2 md:h-56">
                    <Image
                      src={item.image} // Use the image property from your object
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg shadow-md border-1 border-black"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrow marks for the carousel left and right */}
      <div className="hover:cursor-pointer">
        <CarouselPrevious className="ml-3 cursor-pointer" />
        <CarouselNext className="mr-3 cursor-pointer" />
      </div>
    </Carousel>
  )
}
