import { combineReducers } from "redux";
import customerReducer from "./CustomerReducers";
import productReducer from "./ProductReducers";
import productCategoryReducer from "./ProductCategoryDeducers";
import productCategoryNoPageReducer from "./CategoryProductNoPageReducers";
import roleReducer from "./RoleReducers";
import permissionsReducer from "./PermissionsReducers";
import blogsCategoriesReducer from "./BlogsCategoriesReducers";
import blogReducer from "./BlogReducers";
import promotionReducer from "./PromotionsReducers";
import employeeReducer from "./EmployeeReducers";
import tablesReducer from "./TablesReducers";
import authReducer from "./AuthReducers";
import commentBlogReducer from "./CommentBlogReducers";
import userReducer from "./UserReducers";
import UserChatsReducer from "./UserChatsReducer";
import getQuyenHanReducer from "./GetQuyenHanReducers";
import RolePermissionsReducer from "./RolePermissionsReducers";
import Reservations_t_AdminReducer from "./Reservations_t_AdminReducers";
import ReservationDetailReducer from "./GetReservationDetailReducers";
import StatisticalReducer from "./StatisticalReducers";
import revenueTimeReducer from "./RevenueTimeReducers";

const rootReducer = combineReducers({
    customer: customerReducer,
    product: productReducer,
    productCategory: productCategoryReducer,
    productCategoryNoPage: productCategoryNoPageReducer,
    role: roleReducer,
    permissions: permissionsReducer,
    categories: blogsCategoriesReducer,
    blog: blogReducer,
    promotion: promotionReducer,
    employee: employeeReducer,
    tables: tablesReducer,
    auth: authReducer,
    commentBlog: commentBlogReducer,
    users: userReducer,
    userChats: UserChatsReducer,
    getQuyenHan: getQuyenHanReducer,
    rolePermissions: RolePermissionsReducer,
    reservationsAdmin: Reservations_t_AdminReducer,
    reservationDetailsAdmin: ReservationDetailReducer,
    statistical: StatisticalReducer,
    revenueTime: revenueTimeReducer,
});

export default rootReducer;
