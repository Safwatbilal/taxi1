export type PaginationPage = number | "ellipsis";

/**
 * Generates a pagination structure with ellipsis.
 * @param totalPages Total number of pages
 * @param currentPage Current active page
 * @param maxVisiblePages Max number of visible page buttons
 * @returns Array of numbers and "ellipsis"
 */
export function generatePaginationPages(
  totalPages: number,
  currentPage: number,
  maxVisiblePages: number = 5
): PaginationPage[] {
  const pages: PaginationPage[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("ellipsis");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages);
    }
  }

  return pages;
}
