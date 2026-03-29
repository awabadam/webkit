export function getPagination(page: number, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  return { skip, take: pageSize };
}

export function getTotalPages(total: number, pageSize: number = 10) {
  return Math.ceil(total / pageSize);
}
