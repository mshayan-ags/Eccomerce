import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard, MdWarning, MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataComplex from "./variables/tableDataComplex.json";

import { withSaleContext } from "context/Sale";
import { withProductContext } from "context/Product";
import { withUserContext } from "context/User";

const LOW_STOCK_THRESHOLD = 10;

const Dashboard = ({ AllSale, AllProduct, AllUser }) => {
	const navigate = useNavigate();

	const totalRevenue = (AllSale || []).reduce((sum, sale) => sum + Number(sale?.totalAmountAfterDiscount || 0), 0);
	const pendingOrders = (AllSale || []).filter((sale) => sale?.status === "Pending").length;
	const lowStockProducts = (AllProduct || []).filter((product) => Number(product?.quantity) < LOW_STOCK_THRESHOLD);

	const recentOrders = [...(AllSale || [])].slice(0, 5);

	return (
		<div>
			{/* Real store metrics, computed from the actual Sale/Product/User data
			already loaded app-wide - this used to be six hardcoded numbers. */}
			<div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
				<Widget
					icon={<MdBarChart className="h-7 w-7" />}
					title={"Total Revenue"}
					subtitle={`$${totalRevenue.toFixed(2)}`}
				/>
				<Widget
					icon={<IoDocuments className="h-6 w-6" />}
					title={"Total Orders"}
					subtitle={`${AllSale?.length || 0}`}
				/>
				<Widget
					icon={<MdShoppingCart className="h-6 w-6" />}
					title={"Pending Orders"}
					subtitle={`${pendingOrders}`}
				/>
				<Widget
					icon={<MdDashboard className="h-6 w-6" />}
					title={"Total Products"}
					subtitle={`${AllProduct?.length || 0}`}
				/>
				<Widget
					icon={<IoMdHome className="h-6 w-6" />}
					title={"Total Customers"}
					subtitle={`${AllUser?.length || 0}`}
				/>
				<Widget
					icon={<MdWarning className="h-6 w-6" />}
					title={"Low Stock Products"}
					subtitle={`${lowStockProducts.length}`}
				/>
			</div>

			{/* Charts */}

			<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
				<TotalSpent />
				<WeeklyRevenue />
			</div>

			{/* Real data: recent orders + low stock, instead of the template's
			static JSON-backed "Check Table". */}
			<div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
				<div className="rounded-[20px] bg-white p-6 dark:!bg-navy-800">
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-lg font-bold text-navy-700 dark:text-white">Recent Orders</h4>
						<button onClick={() => navigate("/admin/Sale")} className="text-sm font-medium text-brand-500">View All</button>
					</div>
					{recentOrders.length > 0 ? (
						<div className="flex flex-col gap-3">
							{recentOrders.map((sale) => (
								<div key={sale?._id} onClick={() => navigate(`/admin/EditSale/${sale?._id}`)} className="flex items-center justify-between border-b pb-2 cursor-pointer">
									<div>
										<p className="text-sm font-semibold text-navy-700 dark:text-white">{sale?.User?.name || "Customer"}</p>
										<p className="text-xs text-gray-500">{sale?.status}</p>
									</div>
									<p className="text-sm font-bold text-navy-700 dark:text-white">${Number(sale?.totalAmountAfterDiscount || 0).toFixed(2)}</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-500">No orders yet.</p>
					)}
				</div>

				<div className="rounded-[20px] bg-white p-6 dark:!bg-navy-800">
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-lg font-bold text-navy-700 dark:text-white">Low Stock Products</h4>
						<button onClick={() => navigate("/admin/Product")} className="text-sm font-medium text-brand-500">View All</button>
					</div>
					{lowStockProducts.length > 0 ? (
						<div className="flex flex-col gap-3">
							{lowStockProducts.slice(0, 5).map((product) => (
								<div key={product?._id} onClick={() => navigate(`/admin/AddProduct/${product?._id}`)} className="flex items-center justify-between border-b pb-2 cursor-pointer">
									<p className="text-sm font-semibold text-navy-700 dark:text-white">{product?.name}</p>
									<p className="text-sm font-bold text-red-500">{product?.quantity} left</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-500">Everything is well stocked.</p>
					)}
				</div>

				<div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
					<DailyTraffic />
					<PieChartCard />
				</div>

				<ComplexTable
					columnsData={columnsDataComplex}
					tableData={tableDataComplex}
				/>

				<div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
					<TaskCard />
					<div className="grid grid-cols-1 rounded-[20px]">
						<MiniCalendar />
					</div>
				</div>
			</div>
		</div>
	);
};

export default withSaleContext(withProductContext(withUserContext(Dashboard)));
