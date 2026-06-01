import { Card, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
    console.log("dashbaord rendering")
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">

     <Card>
      <CardHeader>
        <CardTitle>
               Total Sales
        </CardTitle>
      </CardHeader>
     </Card>
    </div>
  )
}

export default Dashboard
