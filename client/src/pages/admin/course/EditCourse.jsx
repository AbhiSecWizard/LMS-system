import { Button } from "@/components/ui/button"
import { Link, useNavigate, useParams } from "react-router-dom"
import CourseTab from "./CourseTab"
const EditCourse = () => {
  const params = useParams()
  const {courseId} = params
  const navigate = useNavigate()

  function gotoEditLecture() {
    navigate(`/admin/course/${courseId}/lecture`)
  }
  return (
    <div className="flex-1">
     <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">Add detail information regarding course</h1>
       <Link >
       <Button variant="link" onClick={gotoEditLecture} className={"hover:text-blue-500 cursor-pointer"}>
         Go to lactures Page 
       </Button>
       </Link>
     
     </div>
       <CourseTab/>
    </div>
  )
}

export default EditCourse
