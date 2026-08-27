"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({ className, ...props }: ProgressPrimitive.Root.Props) {
  return <ProgressPrimitive.Root data-slot="progress" className={cn("w-full", className)} {...props} />
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn("relative h-1 w-full overflow-hidden bg-tshabu-graphite/20", className)}
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("block h-full bg-tshabu-black transition-all duration-300 ease-out", className)}
      {...props}
    />
  )
}

export { Progress, ProgressTrack, ProgressIndicator }
