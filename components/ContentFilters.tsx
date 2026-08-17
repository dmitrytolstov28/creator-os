"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";


type ContentFiltersProps = {
  search: string;
  setSearch: (value: string) => void;

  platform: string;
  setPlatform: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;
};



export default function ContentFilters({
  search,
  setSearch,
  platform,
  setPlatform,
  sort,
  setSort,
}: ContentFiltersProps) {


  return (

    <div className="space-y-4">



      {/* Search System */}

      <div
        className="
          relative
          flex
          items-center
          gap-3
          overflow-hidden
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          px-5
          py-4
          backdrop-blur-xl
          transition
          focus-within:border-emerald-400/50
          focus-within:shadow-[0_0_25px_rgba(0,255,136,0.12)]
        "
      >


        <div
          className="
            absolute
            -right-10
            -top-10
            h-32
            w-32
            rounded-full
            bg-emerald-400/10
            blur-3xl
          "
        />



        <Search
          size={18}
          className="relative text-emerald-400"
        />



        <input

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          placeholder="Search content database..."

          className="
            relative
            w-full
            bg-transparent
            text-white
            outline-none
            placeholder:text-zinc-500
          "

        />


      </div>







      {/* Filter Controls */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.03]
          p-4
          backdrop-blur-xl
        "
      >



        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            uppercase
            tracking-[0.25em]
            text-emerald-400/70
          "
        >

          <SlidersHorizontal size={14}/>

          Control Panel

        </div>







        <select

          value={platform}

          onChange={(e) =>
            setPlatform(e.target.value)
          }

          className="
            rounded-xl
            border
            border-emerald-400/20
            bg-black/40
            px-4
            py-3
            text-sm
            text-white
            outline-none
            transition
            hover:border-emerald-400/50
            focus:border-emerald-400/60
          "

        >

          <option value="All">
            All Platforms
          </option>

          <option value="TikTok">
            TikTok
          </option>

          <option value="YouTube">
            YouTube
          </option>

          <option value="Instagram">
            Instagram
          </option>


        </select>








        <select

          value={sort}

          onChange={(e) =>
            setSort(e.target.value)
          }

          className="
            rounded-xl
            border
            border-emerald-400/20
            bg-black/40
            px-4
            py-3
            text-sm
            text-white
            outline-none
            transition
            hover:border-emerald-400/50
            focus:border-emerald-400/60
          "

        >

          <option value="newest">
            Newest
          </option>

          <option value="views">
            Most Views
          </option>

          <option value="engagement">
            Highest Engagement
          </option>


        </select>



      </div>


    </div>

  );

}