import React from "react";

function ResumeCertificationSection({ certificationDetails }) {
  return (
    <>
      <h5 className="lg:pb-4 pb-2 text-lg font-semibold">Certification</h5>
      {certificationDetails &&
        certificationDetails.map((data, i) => (
          <div key={i}>
            <h4 className="text-md mb-2 font-semibold">
              {data?.certification_authority}
            </h4>
            <p>{data?.certification_name} </p>
          </div>
        ))}
    </>
  );
}

export default ResumeCertificationSection;
