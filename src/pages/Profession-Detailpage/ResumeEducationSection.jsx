import React from "react";

function ResumeEducationSection({ educationDetails }) {
  return (
    <>
      <h5 className="lg:pb-4 pb-2 text-lg font-semibold">Education</h5>
      {educationDetails &&
        educationDetails.map((data, i) => (
          <div key={i}>
            <h4 className="text-md mb-2 font-semibold">
              {data?.university_name}
            </h4>
            <p>
              {data?.from_year} - {data?.to_year}, {data?.degree_name}
            </p>
          </div>
        ))}
    </>
  );
}

export default ResumeEducationSection;
