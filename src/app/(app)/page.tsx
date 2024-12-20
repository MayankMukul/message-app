
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from '@/messages.json';

export default function Home() {
  return (
    <>
    
   <main className="flex-grow flex flex-col items-center justify-center px-4 md:py-12">
    <section className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-5xl font-bold">Dive into the world of mystery message</h1>
      <p className="mt-3 md:mt-4 text-base md:text-lg">Explore the mystery message </p>
    </section>
   
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

   </main>
   <footer className="text-center p-4 md:p-6">
        © 2024 Message. All rights reserved.
   </footer>
   </>
  );
}
