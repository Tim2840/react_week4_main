import { NotebookPen, Trash } from "lucide-react";
import PropTypes from "prop-types";
import Pagination from "./Pagination";

function ProductList({
  loading,
  products,
  setTempProduct,
  deleteProduct,
  pageInfo,
  handlePageChange,
}) {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow-sm position-relative">
          {loading && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
              style={{ zIndex: 10 }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="card-body p-0">
            {products.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="mb-0">尚無商品</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="product-table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="col-md-1">類別</th>
                        <th className="col-md-4">商品名稱</th>
                        <th className="col-md-2">原價</th>
                        <th className="col-md-2">售價</th>
                        <th className="col-md-1">是否啟用</th>
                        <th className="col-md-2">編輯 / 刪除</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const {
                          id,
                          category,
                          title,
                          origin_price,
                          price,
                          is_enabled,
                        } = product;

                        return (
                          <tr key={id}>
                            <td className="fw-500">{category}</td>
                            <td className="fw-500">{title}</td>
                            <td>NT$ {origin_price}</td>
                            <td className="text-danger fw-bold">NT$ {price}</td>
                            <td>
                              <span
                                className={`badge ${
                                  is_enabled ? "bg-success" : "bg-secondary"
                                }`}
                              >
                                {product.is_enabled ? "啟用" : "停用"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-action btn-sm d-inline-flex align-items-center me-1"
                                onClick={() =>
                                  setTempProduct({
                                    ...product,
                                    imageUrl: product.imageUrl || "",
                                    imagesUrl: product.imagesUrl || [],
                                  })
                                }
                              >
                                <NotebookPen size={16} className="me-1" />
                                編輯
                              </button>
                              <button
                                className="btn btn-danger btn-sm d-inline-flex align-items-center"
                                onClick={() => deleteProduct(id, title)}
                              >
                                <Trash size={16} className="me-1" />
                                刪除
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination 區塊 */}
                <div className="p-3">
                  <Pagination
                    pageInfo={pageInfo}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ProductList.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  setTempProduct: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  pageInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default ProductList;
