"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { api } from "~/trpc/react";

export const SelectCategories = () => {
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const selectedCategories = api.user.getSelectedCategories.useQuery(
    undefined,
    {
      retry: (_count, err) => {
        // `onError` only runs once React Query stops retrying
        if (err.data?.code === "UNAUTHORIZED") {
          return false;
        }
        return true;
      },
    },
  );
  const categories = api.category.getAllCategories.useQuery();

  const router = useRouter();

  useEffect(() => {
    if (
      selectedCategories.isError &&
      selectedCategories.error.data?.code === "UNAUTHORIZED"
    ) {
      router.replace("/login");
    }
    console.log({ data: categories.data });
  }, [selectedCategories]);

  const markIdLoading = (id: number) => {
    setLoadingIds((ids) => {
      if (ids.includes(id)) return ids;
      return [...ids, id];
    });
  };
  const markIdNotLoading = (id?: number) => {
    if (id)
      setLoadingIds((ids) => {
        const index = ids.indexOf(id);
        if (index >= 0) ids.splice(index, 1);
        return ids;
      });
  };
  const selectCategory = api.user.selectCategory.useMutation({
    onSettled: async (data) => {
      await selectedCategories.refetch();
      markIdNotLoading(data?.updatedId);
    },
  });

  const deSelectCategory = api.user.deSelectCategory.useMutation({
    onSettled: async (data) => {
      await selectedCategories.refetch();
      markIdNotLoading(data?.affectedIds[0]);
    },
  });

  const addUserSelection = (id: number) => {
    selectCategory.mutate(id);
    markIdLoading(id);
  };
  const removeUserSelection = (id: number) => {
    deSelectCategory.mutate(id);
    markIdLoading(id);
  };

  if (categories.isPending || selectedCategories.isPending) return;

  return (
    <div className="container">
      <h1 className="my-[15px] text-center text-[24px] font-semibold md:text-[32px]">
        Please mark your interests!
      </h1>
      <h1 className="my-[10px] mb-[35px] text-[14px] text-[#333]">
        We will keep you notified.
      </h1>
      <div className="item-start w-full md:w-[456px]">
        <div className="mb-[17px] text-[20px] font-medium">
          My saved interests!
        </div>
        <ul className="h-[291px]">
          {categories.data
            ?.slice((page - 1) * 6, (page - 1) * 6 + 6)
            .map((item) => {
              const isMarked = selectedCategories.data?.selectedCategories
                .map((e) => e.categoryId)
                .includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex cursor-pointer py-2 capitalize hover:bg-gray-100"
                  onClick={() => {
                    if (isMarked) removeUserSelection(item.id);
                    else addUserSelection(item.id);
                  }}
                >
                  <div className="mr-[10px] flex text-[16px]">
                    {isMarked ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="24" rx="4" fill="black" />
                        <path
                          d="M5 13L8.5 17L19 7"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="24" rx="4" fill="#CCCCCC" />
                      </svg>
                    )}
                  </div>
                  <span className="capitalize">
                    {item.name +
                      (loadingIds.includes(item.id) ? " [Updating]" : "")}
                  </span>
                </div>
              );
            })}
        </ul>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.ceil((categories.data?.length ?? 1) / 6)}
          neighborCount={3}
        />
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  neighborCount: number;
}> = ({ page, setPage, totalPages, neighborCount }) => {
  let beforeNeighborCount = neighborCount;

  if (page <= neighborCount) beforeNeighborCount = page - 1;
  if (page > totalPages - neighborCount)
    beforeNeighborCount = 2 * neighborCount - totalPages + page;

  const getPageNumber = (index: number) => {
    if (index < beforeNeighborCount) return page - beforeNeighborCount + index;
    if (index > beforeNeighborCount) return page + index - beforeNeighborCount;
    else return page;
  };

  return (
    <div className="mt-[30px] flex items-center gap-[20px] text-dull-light">
      <button
        className="cursor-pointer"
        onClick={() => {
          setPage(1);
        }}
      >
        {"<<"}
      </button>
      <button
        className={page === 1 ? "cursor-not-allowed" : "cursor-pointer"}
        onClick={() => {
          if (page > 1) setPage((page) => page - 1);
        }}
      >
        {"<"}
      </button>

      <div className={"flex gap-3"}>
        {new Array(neighborCount * 2 + 1).fill(-1).map((_, idx) => {
          const pageNumber = getPageNumber(idx);
          if (0 < pageNumber && pageNumber <= totalPages)
            return (
              <span
                className={
                  idx == beforeNeighborCount
                    ? "cursor-pointer font-bold text-dull-dark"
                    : "cursor-pointer"
                }
                onClick={() => {
                  setPage(pageNumber);
                }}
                key={`index-${idx}`}
              >
                {pageNumber}
              </span>
            );
        })}
      </div>

      <button
        className={
          page === totalPages ? "cursor-not-allowed" : "cursor-pointer"
        }
        onClick={() => {
          if (page < totalPages) setPage((page) => page + 1);
        }}
      >
        {">"}
      </button>
      <button
        className="cursor-pointer"
        onClick={() => {
          setPage(totalPages);
        }}
      >
        {">>"}
      </button>
    </div>
  );
};
