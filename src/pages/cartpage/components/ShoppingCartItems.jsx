import { useCallback, useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import {
  getImages,
  convertNumberInNumerals,
  getTotalQtyFromCart,
} from "../../../utils/common-utils";
import { ShoppingCartSkeleton } from "./ShoppingCartSkeleton";
import { Skeleton } from "../../../components/Skeleton";
import { Link } from "react-router-dom";
import { EmptyCartPage } from "./EmptyCart";
import isEmpty from "lodash.isempty";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../redux/slices/cartSlice";
import { getCart, updateCartQty } from "../../../api/protectedApi";
import { deleteCartProduct } from "./../../../api/protectedApi";
import PropTypes from "prop-types";

export const ShoppingCartItems = () => {
  const [cartDataInternal, setCartDataInternal] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state?.auth?.user?.id);

  const dispatch = useDispatch();

  const setCartData = useCallback(
    (data) => {
      dispatch(setCart(data));
      setCartDataInternal(data);
    },
    [dispatch]
  );

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const result = await getCart(userId);
        if (result) {
          setLoading(false);
          if (result.success) {
            setCartData(result.data);
          }
        }
      } catch (error) {
        console.error("Error in retrieving data ", error);
      }
    };
    fetchCartData();
  }, [userId, setCartData]);

  if (isEmpty(cartDataInternal) || isEmpty(cartDataInternal?.items)) {
    return <EmptyCartPage />;
  }

  return (
    <>
      {loading ? (
        <Skeleton Component={ShoppingCartSkeleton} repeatations={1} />
      ) : (
        <div className="flex justify-between">
          <div className="mr-5 mb-5 p-5 bg-white flex-1">
            <div className="text-3xl mb-4">Shopping Cart</div>
            <div className="border-b-2 border-gray-300"></div>
            {cartDataInternal?.items?.map((product, index) => {
              return (
                <ProductCard
                  key={index}
                  product={product}
                  index={0}
                  userId={cartDataInternal.userId}
                  productId={product.productId}
                  setCartData={setCartData}
                />
              );
            })}
            <div className="text-lg text-right">
              <div className="">
                Subtotal ({getTotalQtyFromCart(cartDataInternal.items)} items):
                <span className="font-bold ml-4 ">
                  {convertNumberInNumerals(cartDataInternal?.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------SIDE SECTION CART -------------------------------- */}
          <div className=" font-bold text-lg ">
            <div className="bg-white p-4 pb-6">
              <span className="">
                {" "}
                Subtotal ({getTotalQtyFromCart(cartDataInternal.items)} items):
              </span>
              <span className="ml-4 ">
                {convertNumberInNumerals(cartDataInternal?.totalPrice)}
              </span>
              <div className="text-center mt-2">
                <button className="font-normal text-sm bg-yellow-500 rounded-3xl px-4 py-2 text-center mt-3">
                  Proceed to Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProductCard = ({ product, index, userId, productId, setCartData }) => {
  const handleDelete = async () => {
    try {
      const result = await deleteCartProduct(userId, productId);
      if (result.success) {
        setCartData(result.data);
        console.log(
          "Product Deletion Data from cart sent Successfully",
          result.data
        );
      }
    } catch (err) {
      console.log("Error sending data", err);
    }
  };

  return (
    <>
      <div className="p-3 flex justify-between">
        <img src={getImages(product.images[index++])} className="w-44" />
        <div className="text-lg flex-1 pl-4">
          <Link to={`/products/product/${product.productId}`}>
            <div className="font-bold cursor-pointer">
              {product.productDescription}
            </div>
          </Link>
          <div className="text-sm mt-0.5 font-[500]">{product.productName}</div>
          <div className="text-xs mt-2">Gift Options not available</div>
          <ul className="flex text-sm mt-2 items-center">
            <QuantityUpdationButton
              qty={product.quantity}
              userId={userId}
              productId={product.productId}
              setCartData={setCartData}
            />
            <li className="mx-2">|</li>
            <li className="cursor-pointer" onClick={handleDelete}>
              Delete
            </li>
            <li className="mx-2">|</li>
            <li className="">Save for Later</li>
            <li className="mx-2">|</li>
            <li className="">See more like this</li>
            <li className="mx-2">|</li>
            <li className="">Share</li>
          </ul>
        </div>
        <div className="font-bold text-base ">
          {convertNumberInNumerals(product.price)}
        </div>
      </div>
      <div className="border-b-2 border-gray-300 my-4"></div>
    </>
  );
};

const QuantityUpdationButton = ({ qty, userId, productId, setCartData }) => {
  const backendData = async (qty) => {
    try {
      const result = await updateCartQty(userId, productId, qty);
      if (result.success) {
        console.log("qty updated", result.data);
        setCartData(result.data);
      }
    } catch (err) {
      console.log("Error sending data", err);
    }
  };

  const handleDecrementQuantity = (qty) => {
    if (qty === 0) {
      return null;
    }
    backendData(qty);
  };

  const handleIncrementQuantity = async (qty) => {
    backendData(qty);
  };

  return (
    <>
      <li
        className={`border-yellow-500 border-4 rounded-xl flex m-2 px-2 py-0.5 ml-0 items-center`}
      >
        <div
          className={`font-bold cursor-pointer  ${
            qty === 1
              ? "opacity-25 cursor-not-allowed pointer-events-none"
              : "none"
          }`}
          onClick={() => handleDecrementQuantity(qty - 1)}
        >
          <FaMinus />
        </div>
        <div className="mx-4 font-bold">{qty}</div>
        <div
          className="font-bold p-1 cursor-pointer "
          onClick={() => handleIncrementQuantity(qty + 1)}
        >
          <FaPlus />
        </div>
      </li>
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  setCartData: PropTypes.func.isRequired,
};

QuantityUpdationButton.propTypes = {
  qty: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  setCartData: PropTypes.func.isRequired,
};
