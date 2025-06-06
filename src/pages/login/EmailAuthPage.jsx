import { useEffect } from "react";
import { LogoBlack } from "./LogoBlack";
import { EmailAuthForm } from "./EmailAuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../../routes/routes";
import { LoaderData } from "../../utils/common-components";

export const EmailAuthPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.loader.loading);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-white h-screen">
      <div className="pt-3.5 px-[18px] pb-[22px]">
        <LogoBlack />
        <EmailAuthForm />

        <div className="w-[350px] m-auto text-sm my-10">
          <div className="text-xs text-center p-2 ">New to Amazon?</div>
          <button className="w-full rounded border-2 p-2">
            <Link to={routes.signup}>Create your Amazon account</Link>
          </button>
        </div>
      </div>

      <LoaderData isLoading={isLoading} />
    </div>
  );
};
