import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MenuItem from "@mui/material/MenuItem"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"

import Select, { SelectChangeEvent } from "@mui/material/Select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

export default function RoomOption({ componentName, componentId, middleRoomsId }) {

    const deleteMiddleRooms = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/middleComponent/${middleRoomsId}/${componentId}`)
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="grid w-full grid-cols-4 gap-2">
            <Button variant="outline" disabled className="col-span-3 w-full">{componentName}</Button>
            <Button variant="destructive" className="w-full" onClick={deleteMiddleRooms}>Delete</Button>
        </div>
    )
}
