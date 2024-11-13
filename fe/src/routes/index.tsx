import LayoutAdmin from "@/pages/(dashboard)/layout";
import ProductManagement from "@/pages/(dashboard)/product/page";
import Signin from "@/pages/(website)/(auth)/Signin";
import NotFound from "@/pages/(website)/404/page";
import AboutPage from "@/pages/(website)/about/page";
import CartPage from "@/pages/(website)/cart/page";
import ContactPage from "@/pages/(website)/contact/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import OrderPage from "@/pages/(website)/order/page";
import CategoryDetail from "@/pages/(website)/product/category/detail/page";
import DetailProduct from "@/pages/(website)/product/detail/page";
import ShopPage from "@/pages/(website)/product/page";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Signup from "@/pages/(website)/(auth)/Signup";
import ConfirmPage from "@/pages/(website)/confirm/page";
import AttributeManager from "@/pages/(dashboard)/attributes/page";
import AddAttribute from "@/pages/(dashboard)/attributes/_components/add";
import EditAttribute from "@/pages/(dashboard)/attributes/_components/edit";
import AddProduct from "@/pages/(dashboard)/product/_components/add";
import OrderManager from "@/pages/(dashboard)/order/page";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="products/:id" element={<DetailProduct />} />
                    <Route path="categories/:id" element={<CategoryDetail />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="signin" element={<Signin />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="order" element={<OrderPage />} />
                    <Route path="confirm/:userId/:orderId" element={<ConfirmPage />} />
                </Route>
                <Route
                    path="admin"
                    element={
                        <PrivateRoute>
                            <LayoutAdmin />
                        </PrivateRoute>
                    }
                >
                    <Route path="attributes" element={<AttributeManager />} />
                    <Route path="attributes/add" element={<AddAttribute />} />
                    <Route path="attributes/:id/edit" element={<EditAttribute />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="orders" element={<OrderManager />} />

                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default Router;
