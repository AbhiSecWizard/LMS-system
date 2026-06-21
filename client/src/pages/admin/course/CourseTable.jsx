// import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// 1. Change the import to a Query hook
import { useNavigate } from "react-router-dom"
import { useGetCreatorCourseQuery } from "../../../features/courseApi"
import { Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
const CourseTable = () => {
  const navigate = useNavigate()
  
  // 2. Call it as a Query (it fetches automatically on mount)
  const { data, isLoading, error } = useGetCreatorCourseQuery()
 
  if (isLoading) return <h1>loading ...</h1>
  if (error) return <h1>Error loading courses.</h1>
const courses = data?.courses && Array.isArray(data.courses) ? data.courses : [];
  return (
    <div>
      <Button onClick={() => navigate("create")} className="rounded-sm cursor-pointer">
        Create A New Course
      </Button>
      <Table>
        <TableCaption>A list of your courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
   
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Status</TableHead>
                     <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course.courseTitle}</TableCell>
            
              <TableCell>{course.coursePrice ? `$${course.coursePrice}` : "Free"}</TableCell>
              <TableCell className="text-right cursor-">
                <Badge>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
                <TableCell>
                  <Button  onClick={()=>navigate(`${course._id}`)} size="sm" variant="outline" className="cursor-pointer">
                  <Edit/>
                  </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
export default CourseTable