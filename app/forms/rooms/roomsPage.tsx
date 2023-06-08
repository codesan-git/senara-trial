"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useRooms from "@/app/hooks/getRoomsHooks"

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {
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
              {/* <b>{rooms.name}</b> */}
              {/* <ModalRooms rooms={rooms} /> */}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className="w-full rounded-none">
                    {rooms.name}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteRooms(rooms.id, i)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {/* {ModalCreateRooms(getRooms)} */}
      </div>
    </>
  )
}
