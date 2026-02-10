import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ tempProduct, setTempProduct, getData, isOpen }) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleImageChange = (value, index) => {
    setTempProduct((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value;
      return { ...prev, imagesUrl: newImages };
    });
  };

  const deleteModalImg = () => {
    setTempProduct((prevData) => {
      const newImagesUrl = [...prevData.imagesUrl];
      newImagesUrl.pop();
      return { ...prevData, imagesUrl: newImagesUrl };
    });
  };

  const addModalImg = () => {
    setTempProduct((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""],
    }));
  };

  const updateProduct = async () => {
    const method = tempProduct.id ? "put" : "post";
    const url = tempProduct.id
      ? `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`
      : `${API_BASE}/api/${API_PATH}/admin/product`;

    setIsProcessing(true);
    try {
      const productData = {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price || 0),
        price: Number(tempProduct.price || 0),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: tempProduct.imagesUrl
          ? tempProduct.imagesUrl.filter((url) => url !== "")
          : [],
      };
      const formatProductData = { data: productData };
      await axios[method](url, formatProductData);

      Swal.fire({
        icon: "success",
        title: tempProduct.id ? "更新成功" : "新增成功",
        timer: 1500,
        showConfirmButton: false,
      });

      getData(); // Refresh list
      setTempProduct(null); // Close modal
    } catch (error) {
      const errorMsg = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join("、")
        : error.response?.data?.message || "操作失敗";
      Swal.fire({
        icon: "error",
        title: tempProduct.id ? "更新失敗" : "新增失敗",
        text: `請檢查欄位是否正確: ${errorMsg}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file-to-upload", file);

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      const { imageUrl } = response.data;
      setTempProduct((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
      Swal.fire({
        icon: "success",
        title: "圖片上傳成功",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "圖片上傳失敗",
        text: error.response?.data?.message || "發生錯誤",
      });
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  return (
    isOpen && (
      <div
        className="modal fade show modal-overlay"
        tabIndex="-1"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div
            className="modal-content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title">
                {tempProduct.id ? "編輯商品" : "新增商品"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setTempProduct(null)}
                disabled={isProcessing}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <div className="flex-column mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        主要圖片
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="imageUrl"
                          name="imageUrl"
                          placeholder="請輸入圖片連結"
                          value={tempProduct.imageUrl}
                          onChange={handleModalInputChange}
                        />
                        <button
                          className="btn btn-action btn-sm"
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          disabled={isProcessing}
                        >
                          <ImagePlus size={20} className="me-1" />
                          上傳
                        </button>
                      </div>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={uploadImage}
                      />
                    </div>
                    {tempProduct.imageUrl && (
                      <img
                        src={tempProduct.imageUrl}
                        className="img-fluid rounded d-block mx-auto"
                        alt={tempProduct.title}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    )}
                    {/* 操作圖片 */}
                    <div className="d-flex justify-content-between mt-3 mb-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm w-100 me-2"
                        onClick={addModalImg}
                        disabled={tempProduct.imagesUrl.length >= 5 || isProcessing}
                      >
                        新增圖片
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={deleteModalImg}
                        disabled={tempProduct.imagesUrl.length === 0 || isProcessing}
                      >
                        刪除圖片
                      </button>
                    </div>
                    {/* 副圖 */}
                    {tempProduct.imagesUrl.map((url, index) => (
                      <div key={index} className="mb-3">
                        <label className="form-label">副圖 {index + 1}</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder={`圖片網址 ${index + 1}`}
                          value={url}
                          onChange={(e) =>
                            handleImageChange(e.target.value, index)
                          }
                        />
                        {url && (
                          <img
                            src={url}
                            className="img-fluid rounded mt-2 d-block mx-auto"
                            alt={`副圖 ${index + 1}`}
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        標題
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        placeholder="請輸入標題"
                        value={tempProduct.title}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <select
                          className="form-select"
                          id="category"
                          name="category"
                          value={tempProduct.category}
                          onChange={handleModalInputChange}
                        >
                          <option value="">請選擇分類</option>
                          <option value="蝴蝶結">蝴蝶結</option>
                          <option value="寵物">寵物</option>
                          <option value="甜點">甜點</option>
                          <option value="飲品">飲品</option>
                          <option value="食品">食品</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="unit"
                          name="unit"
                          placeholder="請輸入單位"
                          value={tempProduct.unit}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="origin_price"
                          name="origin_price"
                          placeholder="請輸入原價"
                          value={tempProduct.origin_price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          name="price"
                          placeholder="請輸入售價"
                          value={tempProduct.price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="2"
                        name="description"
                        placeholder="請輸入產品描述"
                        value={tempProduct.description}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        rows="2"
                        name="content"
                        placeholder="請輸入說明內容"
                        value={tempProduct.content}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="is_enabled"
                          name="is_enabled"
                          checked={!!tempProduct.is_enabled}
                          onChange={handleModalInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_enabled"
                        >
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-action"
                onClick={updateProduct}
                disabled={isProcessing}
              >
                {isProcessing ? "處理中..." : tempProduct.id ? "儲存變更" : "新增商品"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setTempProduct(null)}
                disabled={isProcessing}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

ProductModal.propTypes = {
  tempProduct: PropTypes.object.isRequired,
  setTempProduct: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ProductModal;
