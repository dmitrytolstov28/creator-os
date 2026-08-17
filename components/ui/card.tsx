import * as React from "react";

import { cn } from "@/lib/utils";


function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
}) {

  return (

    <div
      data-slot="card"
      data-size={size}

      className={cn(

        `
        group/card
        relative
        flex
        flex-col
        gap-(--card-spacing)

        overflow-hidden

        rounded-2xl

        border
        border-emerald-400/20

        bg-white/[0.04]

        backdrop-blur-xl

        text-white

        shadow-[0_0_35px_rgba(0,255,136,0.08)]

        transition-all
        duration-300

        hover:border-emerald-400/40

        hover:shadow-[0_0_45px_rgba(0,255,136,0.15)]

        [--card-spacing:--spacing(4)]

        data-[size=sm]:[--card-spacing:--spacing(3)]
        `,

        className

      )}

      {...props}

    />

  );
}




function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (

    <div

      data-slot="card-header"

      className={cn(

        `
        relative
        z-10

        grid
        gap-1

        px-(--card-spacing)

        `,

        className

      )}

      {...props}

    />

  );
}





function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (

    <div

      data-slot="card-title"

      className={cn(

        `
        text-base
        font-semibold
        text-white

        `,

        className

      )}

      {...props}

    />

  );
}





function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (

    <div

      data-slot="card-description"

      className={cn(

        `
        text-sm
        text-zinc-400

        `,

        className

      )}

      {...props}

    />

  );

}





function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (

    <div

      data-slot="card-action"

      className={cn(

        `
        justify-self-end

        `,

        className

      )}

      {...props}

    />

  );

}





function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (

    <div

      data-slot="card-content"

      className={cn(

        `
        relative
        z-10

        px-(--card-spacing)

        `,

        className

      )}

      {...props}

    />

  );

}





function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (

    <div

      data-slot="card-footer"

      className={cn(

        `
        relative
        z-10

        flex
        items-center

        border-t
        border-emerald-400/10

        bg-black/20

        p-(--card-spacing)

        `,

        className

      )}

      {...props}

    />

  );

}



export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};