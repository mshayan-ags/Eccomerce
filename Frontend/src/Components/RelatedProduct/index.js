import React from "react";
import Card from "./Card";
import "./index.css";

function RelatedProduct({ heading, subHeading, products }) {
    if (!products?.length) return null;

    return (
        <div className="overflow-hidden w-full flex flex-col items-center justify-center pt-[30px] pb-[30px]">
            <div className="flex flex-row justify-between mt-[28px] mb-[28px] w-full">
                <div>
                    <h2 className="text-[#003459] font-[400] font-actorPro text-[29px] text-2xl leading-36 capitalize mt[5px]">
                        {heading}
                    </h2>
                </div>
            </div>
            <div className="related-product flex overflow-x-scroll w-full pb-[20px]  gap-6">
                {products.map((product) => (
                    <Card key={product?._id} data={product} />
                ))}
            </div>
        </div>
    );
}

export default RelatedProduct;
