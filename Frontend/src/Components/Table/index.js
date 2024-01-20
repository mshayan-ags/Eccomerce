import { useState, useRef, useMemo, useEffect } from "react";
import { withProductContext } from "../../context/Product";
import DogFood from "../../assests/NO Orders.png"
import { useNavigate } from "react-router-dom";

const Table = ({
  GetAllOrders,
  AllOrders,
  OrdersError,
}) => {
  const navigate = useNavigate()
  const [productList, setProductList] = useState([]);
  const [rowsLimit, setRowsLimit] = useState(10);
  const [rowsToShow, setRowsToShow] = useState(productList.slice(0, rowsLimit));
  const [customPagination, setCustomPagination] = useState([]);
  const [totalPage, setTotalPage] = useState(
    Math.ceil(productList?.length / rowsLimit)
  );
  const [currentPage, setCurrentPage] = useState(0);
  const dropdownRef = useRef(null);
  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = AllOrders?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  const changePage = (value) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = AllOrders?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = AllOrders?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };
  useEffect(() => {
    setCustomPagination(
      Array(Math.ceil((AllOrders?.length || 0) / rowsLimit)).fill(null)
    );
  }, [AllOrders, rowsLimit]);

  useEffect(() => {
    GetAllOrders()
  }, [])
  useEffect(() => {
    setProductList(AllOrders || []);
    setRowsToShow((AllOrders || []).slice(0, rowsLimit));
    setCurrentPage(0);
  }, [AllOrders, rowsLimit])

  return (
    <main className="w-full border-2 border-color-[#E6E6E6]   rounded-[8px]">
      <h3 className="font-poppins  text-[25px] px-8 leading-[30px] text-[#1A1A1A] px-10 pt-8">
        Order History
      </h3>
      <hr className="my-4" />
      {rowsToShow?.length > 0 ? (
        <div className=" h-full bg-white flex w-full  py-8 px-10">
          <div className="w-full px-2">
            <div className="w-full overflow-x-scroll md:overflow-auto ">
              <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter  ">
                <thead className=" text-base text-white  w-full">
                  <tr className="bg-[#222E3A]/[6%]">
                    <th className="py-3 px-3 text-[#4D4D4D] font-poppins font-[500] md:text-base  whitespace-nowrap">
                      status
                    </th>
                    <th className="py-3 px-3 text-[#4D4D4D] font-poppins font-[500] md:text-base  whitespace-nowrap">
                      Total
                    </th>
                    <th className="py-3 px-3 text-[#4D4D4D] font-poppins font-[500] md:text-base  whitespace-nowrap">
                      Product
                    </th>
                    <th className="py-3 px-3 text-[#4D4D4D] font-poppins font-[500] md:text-base  whitespace-nowrap">
                      Discount
                    </th>
                    <th className="flex items-center py-3 px-3 text-[#4D4D4D] font-poppins font-[500] md:text-base  whitespace-nowrap gap-1">
                      Tracking Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowsToShow?.map((data, index) => (
                    <tr className={`${"bg-white"}`} key={index}>
                      <td
                        className={`py-2 px-3 font-[400] text-[14px] font-poppins text-[#333333] ${index == 0
                          ? "border-t-2 border-black"
                          : index == rowsToShow?.length
                            ? "border-y"
                            : "border-t"
                          } whitespace-nowrap`}
                      >
                        {data?.status}
                      </td>
                      <td
                        className={`py-2 px-3 font-[400] text-[14px] font-poppins text-[#333333] ${index == 0
                          ? "border-t-2 border-black"
                          : index == rowsToShow?.length
                            ? "border-y"
                            : "border-t"
                          } whitespace-nowrap`}
                      >
                        {"$" + Number(data?.totalAmountAfterDiscount || 0).toFixed(2)}
                      </td>
                      <td
                        className={`py-2 px-3 font-[400] text-[14px] font-poppins text-[#333333] ${index == 0
                          ? "border-t-2 border-black"
                          : index == rowsToShow?.length
                            ? "border-y"
                            : "border-t"
                          } whitespace-nowrap`}
                      >
                        {data?.Product?.length}
                      </td>
                      <td
                        className={`py-2 px-3 font-[400] text-[14px] font-poppins text-[#333333] ${index == 0
                          ? "border-t-2 border-black"
                          : index == rowsToShow?.length
                            ? "border-y"
                            : "border-t"
                          } min-w-[250px]`}
                      >
                        {"$" + (Number(data?.totalAmount) - Number(data?.totalAmountAfterDiscount)).toFixed(2)}
                      </td>
                      <td
                        className={`py-5 px-4 font-[400] text-[14px] font-poppins text-[#333333] ${index == 0
                          ? "border-t-2 border-black"
                          : index == rowsToShow?.length
                            ? "border-y"
                            : "border-t"
                          }`}
                      >
                        {data?.trackingDetails?.trackingNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className=" mt-[20px] w-full  flex justify-center md:justify-between flex-col md:flex-row gap-5 mt-1.5 px-1 items-center">
              <div className="flex justify-center items-center w-full">
                <ul
                  class="flex justify-center items-center gap-x-[10px] z-30"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <li
                    class={` prev-btn flex items-center justify-center w-[36px] rounded-full h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${currentPage == 0
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                      }
  `}
                    onClick={previousPage}
                  >
                    <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                  </li>
                  {customPagination?.map((data, index) => (
                    <li
                      className={`flex items-center justify-center w-[36px] rounded-full h-[34px] border-[1px] border-solid cursor-pointer ${currentPage == index
                        ? " bg-[#1e8a30ff] text-[#fff]"
                        : "  text-[#666666]"
                        }`}
                      onClick={() => changePage(index)}
                      key={index}
                    >
                      {index + 1}
                    </li>
                  ))}
                  <li
                    class={`flex items-center justify-center w-[36px] rounded-full h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage == totalPage - 1
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                      }`}
                    onClick={nextPage}
                  >
                    <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : <div className="h-[60vh] w-full px-[10%] flex flex-col justify-center align-center items-center">
          <img src={DogFood} className="w-[100%] md:w-[40%] h-[30vh] my-[2%]" />
          <h1 className="text-[20px] md:text-[30px] text-center text-primary font-bold">Oops! Your Pet Would Be Hungry!</h1>
          <p className="text-[10px] md:text-[12px] text-[#000000] text-center">
          Your cart is feeling lonely! Why not brighten its day by adding that perfect toy, cozy bed, or healthy treat for your furry friend? Your pet deserves the best, and it’s just a click away. Don’t keep them waiting—treat them to something special today! 🐾✨  </p>
          <button className="my-[5%] bg-[#1e8a30ff] py-[8px] md:py-[16px] w-[50%] md:w-[20%] text-[#fff] rounded-[25px] text-[10px] md:text-[16px] font-[600] leading-[19.2px]" onClick={() => {
          navigate("/Category")
        }}>Order Now</button>
      </div>}
    </main>
  );
};
export default withProductContext(Table);
