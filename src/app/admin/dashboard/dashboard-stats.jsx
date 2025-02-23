import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer
} from "recharts";
import {
  ArrowUp, ArrowDown, DollarSign, ShoppingCart,
  Users, Activity, TrendingUp
} from "react-feather";

function DashboardStats() {
  const [selectedMonth, setSelectedMonth] = useState("February 2025");

  // Example data for monthly sales & revenue
  const dataByMonth = {
    "December 2024": {
      sales: [
        { name: "Week 1", sales: 4800 },
        { name: "Week 2", sales: 6200 },
        { name: "Week 3", sales: 5400 },
        { name: "Week 4", sales: 7800 }
      ],
      revenue: [
        { name: "Week 1", revenue: 10500 },
        { name: "Week 2", revenue: 13000 },
        { name: "Week 3", revenue: 11500 },
        { name: "Week 4", revenue: 14500 }
      ]
    },
    "January 2025": {
      sales: [
        { name: "Week 1", sales: 5200 },
        { name: "Week 2", sales: 6900 },
        { name: "Week 3", sales: 5900 },
        { name: "Week 4", sales: 8200 }
      ],
      revenue: [
        { name: "Week 1", revenue: 11500 },
        { name: "Week 2", revenue: 14000 },
        { name: "Week 3", revenue: 12500 },
        { name: "Week 4", revenue: 16000 }
      ]
    },
    "February 2025": {
      sales: [
        { name: "Week 1", sales: 5500 },
        { name: "Week 2", sales: 7300 },
        { name: "Week 3", sales: 6300 },
        { name: "Week 4", sales: 8600 }
      ],
      revenue: [
        { name: "Week 1", revenue: 12000 },
        { name: "Week 2", revenue: 14500 },
        { name: "Week 3", revenue: 13000 },
        { name: "Week 4", revenue: 17000 }
      ]
    }
  };

  // Example data for customer activity (Line Chart)
  const customerActivityData = [
    { name: "Week 1", activity: 150 },
    { name: "Week 2", activity: 220 },
    { name: "Week 3", activity: 180 },
    { name: "Week 4", activity: 240 }
  ];

  // Example data for liquor categories (Pie Chart)
  const liquorCategories = [
    { name: "Vodka", value: 10 },
    { name: "Whiskey", value: 15 },
    { name: "Rum", value: 8 },
    { name: "Gin", value: 12 },
    { name: "Tequila", value: 20 },
    { name: "Bourbon", value: 6 },
    { name: "Scotch", value: 9 },
    { name: "Brandy", value: 7 },
    { name: "Cognac", value: 4 },
    { name: "Champagne", value: 10 }
  ];
  
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#9C27B0", "#F44336", "#E91E63", "#FF5722",
    "#795548", "#4CAF50"
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">$54,890</h3>
              <p className="text-sm text-green-500 flex items-center mt-2">
                <ArrowUp size={16} className="mr-1" />
                +8.5%
              </p>
            </div>
            <div className="bg-black bg-opacity-5 p-3 rounded-full">
              <DollarSign size={24} className="text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">1,290</h3>
              <p className="text-sm text-red-500 flex items-center mt-2">
                <ArrowDown size={16} className="mr-1" />
                -2.3%
              </p>
            </div>
            <div className="bg-black bg-opacity-5 p-3 rounded-full">
              <ShoppingCart size={24} className="text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold">3,456</h3>
              <p className="text-sm text-green-500 flex items-center mt-2">
                <ArrowUp size={16} className="mr-1" />
                +12.5%
              </p>
            </div>
            <div className="bg-black bg-opacity-5 p-3 rounded-full">
              <Users size={24} className="text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">2.4%</h3>
              <p className="text-sm text-green-500 flex items-center mt-2">
                <ArrowUp size={16} className="mr-1" />
                +4.7%
              </p>
            </div>
            <div className="bg-black bg-opacity-5 p-3 rounded-full">
              <Activity size={24} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart & Pie Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart (Customer Activity) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart (Liquor Categories) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Liquor Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={liquorCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={120}
                dataKey="value"
              >
                {liquorCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales & Revenue row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview (Area Chart) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataByMonth[selectedMonth].sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                fillOpacity={0.3}
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Overview (Bar Chart) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataByMonth[selectedMonth].revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month selection dropdown */}
      <div className="flex justify-center mt-6">
        <select
          className="select select-bordered"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Object.keys(dataByMonth).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-black bg-opacity-5 p-2 rounded-full">
                  <TrendingUp size={16} className="text-black" />
                </div>
                <div>
                  <p className="font-medium">
                    New order #ORD-{Math.floor(Math.random() * 1000)}
                  </p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <span className="text-sm font-medium">
                ${(Math.random() * 1000).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
