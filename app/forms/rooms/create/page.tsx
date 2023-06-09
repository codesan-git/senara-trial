import { ComponentRoomPage } from "../../components/rooms/componentRoomPage"

interface FormData {
  name: string
  description: string
  image: string
  imgName: string
}

export default function CreateRooms(data:FormData) {
  return (
    <div className=''>
      <ComponentRoomPage name={""} description={""} image={""} imgName={""} />
    </div>
  )
}
