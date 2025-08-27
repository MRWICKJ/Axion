"use client";
import { Mic, BarChart3, Zap, Clock, Smartphone, Bookmark } from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";

export function Feature() {
  return (
    <section className="py-20 relative z-10">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        ⚙️ Features
      </h2>

      <ul
        className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 px-6 max-w-6xl mx-auto"
      >
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Mic className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Voice Input"
          description="Speak your queries directly (coming soon)." 
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<BarChart3 className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Multiple Difficulty Levels"
          description="Choose from different challenge intensities." 
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/2/8]"
          icon={<Zap className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Instant AI Answers"
          description="Get results powered by AI instantly." 
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Clock className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Timer Based Mode"
          description="Practice under timed conditions." 
        />
        <GridItem
          area="md:[grid-area:3/1/4/7] xl:[grid-area:2/5/3/8]"
          icon={<Smartphone className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Mobile Friendly"
          description="Optimized for all devices." 
        />
        <GridItem
          area="md:[grid-area:3/7/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Bookmark className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="No Signup Needed"
          description="Start using instantly without registration." 
        />
      </ul>
    </section>
  );
}

const GridItem = ({
  area,
  icon,
  title,
  description
}) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl font-semibold text-black md:text-2xl dark:text-white">
                {title}
              </h3>
              <p className="font-sans text-sm text-black md:text-base dark:text-neutral-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
