import { accountMenu } from "../../../../../utils/common-consts";
import { Link } from "react-router-dom";
import { logoutUser } from "../../../../../api/auth";
import { logout } from "../../../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../../../routes/routes";

export const AccountMenu = () => {
  const userData = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const onLogout = () => {
    logoutUser();
    dispatch(logout());
  };
  return (
    <div
      className="invisible group-hover:visible z-[5] bg-white text-black shadow-lg  rounded-sm border-[#bbb]  w-[450px] -left-64
       absolute top-[54px] after:content-['']  after:absolute after:bottom-[100%] after:left-[71.5%] after:border-[10px] after:border-b-white after:border-l-transparent after:border-t-transparent  after:border-r-transparent"
    >
      <div className="mx-5 mt-4 mb-5 ">
        {!userData && (
          <div className="flex-col ">
            <Link to={routes.signup}>
              <div className="bg-[#FFD814] text-[#111] font-[400] rounded-lg m-auto text-[13px] w-[220px] h-[33px] text-center pt-1.5 cursor-pointer">
                Sign in
              </div>
            </Link>
            <div className="text-[11px] text-center mt-1">
              New customer?
              <Link to={routes.signup}> Start here.</Link>
            </div>
          </div>
        )}
        <div className=" absolute left-5 top-[77px] w-[450px] opacity-50" />
        <div className="flex flex-row gap-4 w-full my-4">
          {accountMenu?.map((data, index) => {
            return (
              <section
                key={index}
                className={`flex-1 p-4 ${
                  data.section === "left" ? "border-r border-gray-300" : ""
                }`}
              >
                <h3 className="font-bold text-[16px]">{data.title}</h3>
                <ul className="font-normal mt-1">
                  {data.items?.map((item) => {
                    return (
                      <li
                        key={item.value}
                        className="text-[13px] text-[#444] leading-6 hover:underline  hover:font-bold"
                      >
                        {item.category}
                      </li>
                    );
                  })}
                  <li
                    className="font-[500] text-[13px] hover:underline cursor-pointer"
                    onClick={onLogout}
                  >
                    Logout
                  </li>
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
