import React, { ReactNode } from 'react';

interface Row {
  left: ReactNode;
  right: ReactNode;
}

const Row = ({ left, right }: Row) => {
  return (
    <div className="row mb6 justify-content-around">
      <div className="col-md-4">{left}</div>
      <div className="col-md-4">{right}</div>
    </div>
  );
};

export default Row;
