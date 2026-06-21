import { Button } from "@base-ui/react"
// import { FaArrowRightArrowLeft } from "react-icons/fa6"
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom"
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const params =   useParams()
  const courseId = params.courseId
  console.log(courseId)
  return (
    <div className="flex flex-col mb-5">
        <div className="flex items-center gap-2">
           <Link className="" to={`/admin/course/${courseId}/lecture`}>
           <Button size={'icon'} varient='outline' className={"cursor-pointer bg-gray-100 px-4 py-4 rounded-full"}>
            <FaArrowLeft size={16}/>
           </Button>
           </Link>
           <h1 className="font-bold">Update your Lecture</h1>
         
        </div>
          <LectureTab/>
    </div>
  )
}

export default EditLecture
