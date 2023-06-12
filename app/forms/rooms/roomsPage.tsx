"use client"

import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import createRooms from "@/app/forms/public/forms/createRooms.jpg"
import useRooms from "@/app/hooks/forms/rooms/getRoomsHooks"

interface RoomsProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square"
}

export default function RoomsPage({ aspectRatio = "portrait" }) {
  const { data: getRooms = [] } = useRooms()

  async function deleteRooms(data: FormData, i: number) {
    fetch(`http://localhost:3000/api/theme/${getRooms[i].id}`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-20">
        {/* {renderrooms()} */}

        {getRooms.map((rooms: any, i: number) => (
          <div
            key={rooms.id}
            // style={{ border: "1px solid #ccc", textAlign: "center" }}
            // className="border-light-blue-500 m-4 border-4 border-double"
          >
            <div key={rooms.id}>
              <div className="overflow-hidden rounded-md">
                {rooms.image && (
                  <Image
                    src={rooms?.image}
                    alt={`rooms ${rooms.name}`}
                    width={300}
                    height={300}
                    className={cn(
                      "h-auto w-auto object-cover transition-all hover:scale-105",
                      aspectRatio === "portrait"
                        ? "aspect-[3/4]"
                        : "aspect-square"
                    )}
                  />
                )}
              </div>
              <Button variant="default" className="w-full rounded-none">
                Create Rooms
              </Button>
            </div>
          </div>
        ))}
        {/* {ModalCreateRooms(getRooms)} */}
        <div className="overflow-hidden rounded-md">
          <Link href={"/forms/rooms/create"} target="_self" rel="noreferrer">
            <Image
              src={createRooms}
              alt={"create rooms"}
              width={300}
              height={300}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
            <Button variant="default" className="w-full rounded-none">
              Create Rooms
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
