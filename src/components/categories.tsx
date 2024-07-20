"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const SelectCategories = () => {
  const [page, setPage] = useState(1);
  const categories = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "100",
  ];
  const [userIntrests, setUserIntrests] = useState<string[]>([]);
  return (
    <div className="container">
      <h1 className="my-[15px] text-center text-[24px] font-semibold md:text-[32px]">
        Please mark your interests!
      </h1>
      <h1 className="my-[10px] mb-[35px] text-[14px] text-[#333]">
        We will keep you notified.
      </h1>
      <div className="item-start w-full md:w-[456px]">
        <div className="inter mb-[17px] text-[20px] font-medium">
          My saved interests!
        </div>
        <ul className="h-[291px]">
          {categories
            .slice((page - 1) * 6, (page - 1) * 6 + 6)
            .map((item, index) => {
              return (
                <div
                  key={item + index}
                  className="inter mb-[20px] flex capitalize"
                >
                  <div className="mr-[10px] flex text-[16px]">
                    {userIntrests.includes(item) ? (
                      <svg
                        className="cursor-pointer"
                        onClick={() => {
                          const index = userIntrests.indexOf(item);
                          if (index >= 0)
                            //@ts-ignore
                            setUserIntrests(userIntrests.toSpliced(index, 1));
                        }}
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
                        className="cursor-pointer"
                        onClick={() => {
                          setUserIntrests([...userIntrests, item]);
                        }}
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
                  <span className="capitalize">{item}</span>
                </div>
              );
            })}
        </ul>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.floor(categories.length / 6)}
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
  useEffect(() => {
    console.log({ page, totalPages, neighborCount });
    console.log(
      new Array(2 * neighborCount + 1).fill(0).map((_, i) => getPageNumber(i)),
    );
  }, [page]);
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
        {new Array(neighborCount * 2 + 1).fill(-1).map((item, idx) => {
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
