import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchaseCoursesQuery } from "@/features/purchaseApi";
import { CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";

const Dashboard = () => {
  console.log("Dashboard rendering with real response structure");
  
  const { data, isLoading, isError } = useGetPurchaseCoursesQuery();

  if (isLoading) return <h1 className="text-center mt-10 font-medium text-slate-500">Loading Dashboard Data...</h1>;
  if (isError) return <h1 className="text-center mt-10 text-red-500">Failed to load dashboard statistics.</h1>;

  // Safe fallback array
  const purchasedCourses = data?.purchasedCourse || [];

  // 1. Dynamic Total Sales Count (Aapke case mein 9 aayega)
  const totalSales = purchasedCourses.length;

  // 2. Dynamic Total Revenue Calculation
  // 🎯 CRITICAL FIX: Direct element.amount se data uthaya hai kyuki courseId null aa raha hai
  const totalRevenue = purchasedCourses.reduce((acc, element) => {
    return acc + (element?.amount || 0);
  }, 0);

  // 3. Transform Data for Recharts Line Chart
  const courseChartData = purchasedCourses.map((element, idx) => {
    // Agar courseId null hai toh safe name fallback lagaya
    const title = element?.courseId?.courseTitle 
      ? element.courseId.courseTitle.substring(0, 15) + "..."
      : `Order #${element?.paymentId?.substring(0, 6) || idx + 1}`;

    return {
      name: title,
      price: element?.amount || 0, // Direct amount from purchase object
    };
  });

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>

      {/* Cards Metric Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* Total Sales Card */}
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-slate-900">
              {totalSales}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total completed checkouts</p>
          </CardContent>
        </Card>

        {/* Total Revenue Card */}
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-emerald-600">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-emerald-500/80 mt-1">Lifetime dynamic earnings</p>
          </CardContent>
        </Card>

        {/* Analytics Chart Card */}
        <Card className="shadow-md border border-slate-100 bg-white md:col-span-1 sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Sales Value Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={courseChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  fontSize={10}
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Amount Paid"]} 
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 7 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;