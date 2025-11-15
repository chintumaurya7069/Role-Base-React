import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "tabler-icons-react";

import './pagination.css'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  const handleFirstPage = () => onPageChange(1);
  const handleLastPage = () => onPageChange(totalPages);
  const handlePrevPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNextPage = () =>
    onPageChange(Math.min(currentPage + 1, totalPages));

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      } else if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="pagination-main-container">
        <div className="row mx-2 justify-content-between">
          <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
            <div className="dt-info" aria-live="polite" role="status">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>
          </div>
          <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-2">
            <div className="dt-paging">
              <nav aria-label="pagination">
                <ul className="pagination">
                  <li
                    className={`dt-paging-button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link custom-pagination-btn first"
                      type="button"
                      aria-disabled={currentPage === 1}
                      aria-label="First"
                      onClick={handleFirstPage}
                    >
                      <ChevronsLeft className="icon-18px" />
                    </button>
                  </li>
                  <li
                    className={`dt-paging-button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="custom-pagination-btn page-link previous"
                      type="button"
                      aria-disabled={currentPage === 1}
                      aria-label="Previous"
                      onClick={handlePrevPage}
                    >
                      <ChevronLeft className="icon-18px" />
                    </button>
                  </li>

                  {getPageNumbers().map((number) => (
                    <li
                      key={number}
                      className={`dt-paging-button page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        type="button"
                        onClick={() => onPageChange(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`dt-paging-button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="custom-pagination-btn page-link next"
                      type="button"
                      aria-disabled={currentPage === totalPages}
                      aria-label="Next"
                      onClick={handleNextPage}
                    >
                      <ChevronRight className="icon-18px" />
                    </button>
                  </li>
                  <li
                    className={`dt-paging-button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="custom-pagination-btn page-link last"
                      type="button"
                      aria-disabled={currentPage === totalPages}
                      aria-label="Last"
                      onClick={handleLastPage}
                    >
                      <ChevronsRight className="icon-18px" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagination;
