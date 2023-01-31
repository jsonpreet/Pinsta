import React, { FC } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import clsx from "clsx";

interface Props {
    direction: string;
    moveSlide: () => void;
}

const SliderBtn:FC<Props> = ({ direction, moveSlide }) => {
    return (
        <button
            onClick={moveSlide}
            className={clsx(
                    'bg-black/70 hover:bg-white hover:text-black transition-all delay-75 flex w-10 h-10 rounded-full justify-center items-center text-white',
                    direction === "next" ? "mr-2" : "ml-2"
                )
            }
        >
            {direction === "next" ? <BiChevronRight size={24} /> : <BiChevronLeft size={24} />}
        </button>
    );
}

export default SliderBtn;