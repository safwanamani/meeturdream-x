import React from "react";
import Header from "../../components/Header";
import ProfessionCard from "../Search/ProfessionCard";

const WishList = ({items}) => {
    return (
        <>
            <Header />
            <section className="xl:pt-28 lg:pt-10">
                <div className="container mx-auto xl:px-20">
                {/* <ProfessionCard /> */}
                </div>
            </section>
        </>
    )
}

export default WishList;