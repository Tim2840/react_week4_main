import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Sparkles, LogOut, Plus } from "lucide-react";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function AdminLayout({ setIsAuth }) {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPageInfo(response.data.pagination);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "取得商品失敗",
        text: `請重新整理頁面!${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (e, page) => {
    console.log("現在要切換到第幾頁：", page);
    e.preventDefault();
    fetchProducts(page);
  };

  const openAddProductModal = () => {
    setSelectedProduct({
      category: "",
      content: "",
      description: "",
      id: "",
      imageUrl: "",
      imagesUrl: [],
      is_enabled: 0,
      origin_price: 0,
      price: 0,
      title: "",
      unit: "",
      num: 0,
    });
  };

  const deleteProduct = async (targetId, title) => {
    try {
      const result = await Swal.fire({
        title: `確定要刪除商品 "${title}" 嗎?`,
        text: `刪除後將無法復原`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#949494",
        confirmButtonText: "刪除",
        cancelButtonText: "取消",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${API_BASE}/api/${API_PATH}/admin/product/${targetId}`,
        );
        fetchProducts(); // 刪除後重新取得當前頁面資料
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "操作失敗";
      Swal.fire({
        icon: "error",
        title: "刪除失敗",
        text: `請稍後重試!${errorMsg}`,
      });
    }
  };

  const handleLogout = () => {
    document.cookie = "hexToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuth(false);
    Swal.fire({
      icon: "success",
      title: "登出成功",
      timer: 1500,
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light admin-layout">
      {/* Nav */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-4">
          <a
            className="navbar-brand d-flex align-items-center fw-bold"
            href="#"
          >
            <Sparkles color="#ff758c" size={24} className="me-2" />
            後台管理
          </a>
          <button
            className="btn btn-outline-light btn-sm ms-auto d-flex align-items-center"
            onClick={handleLogout}
          >
            <LogOut size={18} className="me-2" />
            登出
          </button>
        </div>
      </nav>

      <main className="container-fluid flex-grow-1 px-4 py-4">
        {/* 標題 */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-start align-items-center">
            <h2 className="h3 mb-0 me-3">商品列表</h2>
            <button
              className="btn-sm btn-action d-flex align-items-center pe-3"
              onClick={openAddProductModal}
            >
              <Plus size={16} className="me-1" />
              新增商品
            </button>
          </div>
        </div>

        {/* 商品列表 */}
        <ProductList
          products={products}
          setTempProduct={setSelectedProduct}
          deleteProduct={deleteProduct}
          pageInfo={pageInfo} // 傳遞分頁資訊
          handlePageChange={handlePageChange} // 傳遞換頁函式
          loading={loading} // 將 loading 狀態傳遞給 ProductList
        />
      </main>

      <footer className="bg-white py-3 border-top mt-5">
        <div className="container-fluid text-center">
          <p className="mb-0 text-muted small">
            &copy; {new Date().getFullYear()} 愛哆啦也愛手作後台管理系統
          </p>
        </div>
      </footer>

      {/* Modal */}
      <ProductModal
        isOpen={selectedProduct}
        tempProduct={selectedProduct}
        setTempProduct={setSelectedProduct}
        getData={fetchProducts}
      />
    </div>
  );
}

AdminLayout.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
};

export default AdminLayout;
