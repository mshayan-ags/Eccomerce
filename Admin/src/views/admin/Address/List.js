import MUI from "../../../components/Tables/MUI/index";
import { withAddressContext } from "context/Address";
import { useEffect } from "react";

const Tables = ({
  AllAddress,
  GetAllAddress,
  AddressError,
}) => {
  useEffect(() => {
    GetAllAddress();
  }, []);

  const Columns = [
    {
      headerName: "full_name",
      field: "full_name",
    },
    {
      headerName: "phone_number",
      field: "phone_number",
    },
     {
      headerName: "address_line1",
      field: "address_line1",
    },
    {
      headerName: "address_line2",
      field: "address_line2",
    },
     {
      headerName: "city",
      field: "city",
    },
    {
      headerName: "state",
      field: "state",
    },
     {
      headerName: "postal_code",
      field: "postal_code",
    },
    {
      headerName: "country",
      field: "country",
    },
     {
      headerName: "is_default",
      field: "is_default",
    },
  ];
  return (
    <div>
      <div class="my-10 mt-5 h-full rounded-[50px] bg-white px-8 pb-20 pt-8">
        <div class="mb-10 grid grid-cols-3 gap-8">
          <h4 className="col-span-2 text-2xl font-bold text-navy-700 dark:text-white">
            All Addresss
          </h4>
        </div>
        {AddressError ? (
          <p>
            <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
              {AddressError}
            </h4>
          </p>
        ) : (
          <MUI columns={Columns} rows={AllAddress} />
        )}
      </div>
    </div>
  );
};

export default withAddressContext(Tables);
