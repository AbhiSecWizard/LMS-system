import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchaseCoursesQuery } from "@/features/purchaseApi";
import { CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";

const Dashboard = () => {
  console.log("Dashboard rendering with real response structure");
  
  const { data, isLoading, isError } = useGetPurchaseCoursesQuery();

  // 🟢 FIXED: Loading and Error messages fully themed
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-center font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Loading Dashboard Data...
        </h1>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-center font-semibold text-red-500 dark:text-red-400">
          Failed to load dashboard statistics.
        </h1>
      </div>
    );
  }

  // Safe fallback array
  const purchasedCourses = data?.purchasedCourse || [];

  // 1. Dynamic Total Sales Count
  const totalSales = purchasedCourses.length;

  // 2. Dynamic Total Revenue Calculation
  const totalRevenue = purchasedCourses.reduce((acc, element) => {
    return acc + (element?.amount || 0);
  }, 0);

  // 3. Transform Data for Recharts Line Chart
  const courseChartData = purchasedCourses.map((element, idx) => {
    const title = element?.courseId?.courseTitle 
      ? element.courseId.courseTitle.substring(0, 15) + "..."
      : `Order #${element?.paymentId?.substring(0, 6) || idx + 1}`;

    return {
      name: title,
      price: element?.amount || 0,
    };
  });

  return (
    // 🟢 WRAPPER: Responsive spacing and grid adaptation
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
        Admin Dashboard
      </h1>

      {/* Cards Metric Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Total Sales Card */}
        <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-zinc-900 transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalSales}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total completed checkouts</p>
          </CardContent>
        </Card>

        {/* Total Revenue Card */}
        <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-zinc-900 transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-emerald-500/80 dark:text-emerald-500/50 mt-1">Lifetime dynamic earnings</p>
          </CardContent>
        </Card>

        {/* Analytics Chart Card */}
        <Card className="shadow-md border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-zinc-900 col-span-1 sm:col-span-2 lg:col-span-1 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              Sales Value Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={courseChartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                {/* 🟢 FIXED: Cartesian Grid line color dynamically adapts to dark mode via Tailwind CSS or lighter Hex */}
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800/50" />
                
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  className="text-slate-400 dark:text-slate-500"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  fontSize={10}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-slate-400 dark:text-slate-500"
                  fontSize={11} 
                />
                
                {/* 🟢 FIXED: Tooltip background and text colors change smoothly with Dark Mode */}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--tw-content-bg, #ffffff)", 
                    borderRadius: "12px", 
                    border: "1px solid currentColor" 
                  }}
                  className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-slate-800 shadow-xl"
                  labelStyle={{ color: "currentColor", fontWeight: "bold" }}
                  itemStyle={{ color: "#2563eb" }}
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Amount Paid"]} 
                />
                
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "currentColor" }}
                  className="text-white dark:text-zinc-900"
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