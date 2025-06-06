import { ShoppingCartItems } from "../components/ShoppingCartItems";

export const Cartpage = () => {
  return (
    <>
      <div className="w-full min-w-[998px] bg-[#EAEDED] px-[18px] py-3.5 my-0 mx-auto">
        <div className="max-w-[1500px] m-auto text-sm leading-5 ">
          <ShoppingCartItems />

          <div className="text-xs">
            The price and availability of items at Amazon.in are subject to
            change. The shopping cart is a temporary place to store a list of
            your items and reflects each item&apos;s most recent price. Do you
            have a promotional code? We&apos;ll ask you to enter your claim code
            when it&apos;s time to pay.
          </div>
        </div>
      </div>
    </>
  );
};
