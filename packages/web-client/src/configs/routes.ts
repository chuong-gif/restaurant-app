interface AdminRoutesType {
  dashboard: string;
  login: string;
  otp: string;
  forgot: string;
  acount: string;

  product: string;
  productAdd: string;
  productEdit: string;
  productDelete: string;
  productTamXoa: string;

  categoryProduct: string;
  categoryProductAdd: string;
  categoryProductEdit: string;
  categoryProductDelete: string;

  customer: string;
  customerAdd: string;
  customerEdit: string;
  customerDelete: string;

  employee: string;
  employeeAdd: string;
  employeeEdit: string;
  employeeDelete: string;

  blog: string;
  blogAdd: string;
  blogEdit: string;
  blogDelete: string;

  categoryBlog: string;
  categoryBlogAdd: string;
  categoryBlogEdit: string;
  categoryBlogDelete: string;

  table: string;
  tableAdd: string;
  tableEdit: string;
  tableDelete: string;

  reservation: string;
  reservationAdd: string;
  reservationEdit: string;
  reservationDelete: string;

  order: string;
  orderAdd: string;
  orderEdit: string;
  orderDelete: string;

  orderDetail: string;
  orderDetailAdd: string;
  orderDetailDelete: string;

  promotion: string;
  promotionAdd: string;
  promotionEdit: string;
  promotionDelete: string;

  payMethod: string;
  payMethodAdd: string;
  payMethodEdit: string;
  payMethodDelete: string;

  customerGroup: string;
  customerGroupAdd: string;
  customerGroupEdit: string;
  customerGroupDelete: string;

  places: string;
  placesAdd: string;
  placesEdit: string;
  placesDelete: string;

  role: string;
  roleAdd: string;
  roleEdit: string;
  roleDelete: string;

  permissions: string;
  permissionsAdd: string;
  permissionsEdit: string;
  permissionsDelete: string;

  rolesPermissions: string;
  rolesPermissionsAdd: string;

  commentProducts: string;
  commentProductsDelete: string;

  commentBlogView: string;
  commentBlog: string;
  commentBlogAdd: string;
  commentBlogEdit: string;
  commentBlogDelete: string;

  users: string;
  usersAdd: string;
  usersEdit: string;

  userChats: string;

  reservations_t_admin: string;
  reservations_t_adminAdd: string;
  reservations_t_adminEdit: string;
  reservations_t_adminDelete: string;
  reservations_t_admin_existing_reservations: string;
}

const AdminRoutes: AdminRoutesType = {
  dashboard: "dashboard",
  login: "login",
  otp: "otp",
  forgot: "forgot",
  acount: "acount",

  product: "product",
  productAdd: "product/add",
  productEdit: "product/edit/:id",
  productDelete: "product/delete",
  productTamXoa: "product/tam_xoa",

  categoryProduct: "category-product",
  categoryProductAdd: "category-product/add",
  categoryProductEdit: "category-product/edit/:id",
  categoryProductDelete: "category-product/delete",

  customer: "customer",
  customerAdd: "customer/add",
  customerEdit: "customer/edit/:id",
  customerDelete: "customer/delete",

  employee: "employee",
  employeeAdd: "employee/add",
  employeeEdit: "employee/edit/:id",
  employeeDelete: "employee/delete",

  blog: "blogs",
  blogAdd: "blogs/add",
  blogEdit: "blogs/edit/:id",
  blogDelete: "blogs/delete",

  categoryBlog: "category-blog",
  categoryBlogAdd: "category-blog/add",
  categoryBlogEdit: "category-blog/edit/:id",
  categoryBlogDelete: "category-blog/delete",

  table: "tables",
  tableAdd: "tables/add",
  tableEdit: "tables/edit/:id",
  tableDelete: "tables/delete",

  reservation: "reservation",
  reservationAdd: "reservation/add",
  reservationEdit: "reservation/edit/:id",
  reservationDelete: "reservation/delete",

  order: "order",
  orderAdd: "order/add",
  orderEdit: "order/edit",
  orderDelete: "order/delete",

  orderDetail: "order-detail",
  orderDetailAdd: "order-detail/add",
  orderDetailDelete: "order-detail/delete",

  promotion: "promotions",
  promotionAdd: "promotions/add",
  promotionEdit: "promotions/edit/:id",
  promotionDelete: "promotions/delete",

  payMethod: "pay-method",
  payMethodAdd: "pay-method/add",
  payMethodEdit: "pay-method/edit",
  payMethodDelete: "pay-method/delete",

  customerGroup: "customer-group",
  customerGroupAdd: "customer-group/add",
  customerGroupEdit: "customer-group/edit",
  customerGroupDelete: "customer-group/delete",

  places: "places",
  placesAdd: "places/add",
  placesEdit: "places/edit",
  placesDelete: "places/delete",

  role: "role",
  roleAdd: "role/add",
  roleEdit: "role/edit/:id",
  roleDelete: "role/delete",

  permissions: "permissions",
  permissionsAdd: "permissions/add",
  permissionsEdit: "permissions/edit/:id",
  permissionsDelete: "permissions/delete",

  rolesPermissions: "roles_permissions",
  rolesPermissionsAdd: "roles_permissions/add",

  commentProducts: "comment-products",
  commentProductsDelete: "comment-products/delete",

  commentBlogView: "comment-blog/:blogId",
  commentBlog: "comment-blog",
  commentBlogAdd: "comment-blog/add",
  commentBlogEdit: "comment-blog/edit/:id",
  commentBlogDelete: "comment-blog/delete",

  users: "users",
  usersAdd: "users/add",
  usersEdit: "users/edit/:id",

  userChats: "user-chats",

  reservations_t_admin: "reservations_t_admin",
  reservations_t_adminAdd: "reservations_t_admin/add",
  reservations_t_adminEdit: "reservations_t_admin/edit/:id",
  reservations_t_adminDelete: "reservations_t_admin/delete",
  reservations_t_admin_existing_reservations:
    "reservations_t_admin/existing-reservations",
};

export default AdminRoutes;
