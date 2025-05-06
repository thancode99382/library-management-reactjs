import { StatCard } from "./components/StatCard";

export const Dashboard = () => {
    const dashboardStats = [
      {
        title: "Books Overview",
        stats: [
          { label: "Total Books", value: "1,245" },
          { label: "Available", value: "987" },
          { label: "Borrowed", value: "258" }
        ],
        colorBorder: "border-indigo-600"
      },
      {
        title: "Users",
        stats: [
          { label: "Total Members", value: "342" },
          { label: "Active Today", value: "27" }
        ],
        colorBorder: "border-x-lime-600"
      },

      {
        title: "Recent Activity",
        stats: [
          { label: "Book returned", value:  "The Great Gatsby" },
          { label: "New member registered", value: "John Doe" },
          { label: "Book borrowed", value: "To Kill a Mockingbird" },
        ],
        colorBorder: "border-red-600"
      }
    ];
  
  
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
          {dashboardStats.map((item, index) => (
            <StatCard key={index} title={item.title} stats={item.stats} colorBorder = {item.colorBorder } />
          ))} 
        </div>
      </div>
    );
  };
