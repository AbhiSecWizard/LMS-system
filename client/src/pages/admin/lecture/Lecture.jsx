import { Edit } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const Lecture = ({lecture,courseId,index}) => {
    const navigate = useNavigate()
    const goToUpdateLecture = ()=>{
        navigate(`/admin/course/${courseId}/lecture/${lecture._id}`)
    }
  return ( 
    <div className="flex items-center justify-center bg-white dark:bg-black px-4 py-2 rounded-md my-2 ">
     <h1 className="font-bold text-gray-800 hover:bg-gray-200 transition bg-gray-100 py-2 px-2 rounded dark:text-gray-100  flex justify-between w-full">
     Lecture - {index+1}:  <span className="font-normal">   {lecture.lectureTitle}</span>
      <Edit  
     onClick={goToUpdateLecture}
     size={20}
     className="cursor-pointer text-gray-600 dark:text-gray-300 hove:text-blue-600 dark:hover:text-blue-400"
     />
     </h1>
    
    </div>
  )
}


