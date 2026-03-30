import React, { useState } from "react";
import AlumniCard from "./AlumniCard";
import { ChevronLeft, ChevronRight, Loader2, SearchX } from "lucide-react";
import AlumniModal from "./AlumniModal";
import { useDisclosure } from "@heroui/modal";

const GRADIENTS = ["primary", "teal", "orange", "indigo", "emerald", "purple"];

export default function AlumniGrid({
  alumni = [],
  totalCount = 0,
  page = 1,
  setPage,
  totalPages = 1,
  isLoading = false,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const handleViewDetails = (alumni) => {
    setSelectedAlumni(alumni);
    onOpen();
  };

  // Generate pagination range
  const generatePagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      {/* Stats Overview */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Showing {totalCount} Alumni Members
        </h2>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-slate-400 font-medium animate-pulse">
            Loading alumni network...
          </p>
        </div>
      ) : alumni.length > 0 ? (
        <>
          {/* Alumni Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alumni.map((item, index) => (
              <AlumniCard
                key={item._id}
                alumni={item}
                onViewDetails={() => handleViewDetails(item)}
                gradientFrom={GRADIENTS[index % GRADIENTS.length]}
                occupationColor={GRADIENTS[index % GRADIENTS.length]}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={20} />
                </button>

                {generatePagination().map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 dark:text-slate-400 dark:ring-slate-700"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      onClick={() => setPage(p)}
                      aria-current={page === p ? "page" : undefined}
                      className={
                        page === p
                          ? "relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
                      }
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white/50 dark:bg-neutral-dark/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
            <SearchX size={48} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No Alumni Found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              We couldn't find any alumni matching your search criteria.
            </p>
          </div>
        </div>
      )}

      {/* Alumni Details Modal */}
      <AlumniModal
        isOpen={isOpen}
        onClose={onOpenChange}
        alumni={selectedAlumni}
      />
    </>
  );
}
